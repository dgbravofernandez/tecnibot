"use client";

import { useState, useRef, useEffect } from "react";
import { MACHINES, TYPE_LABELS, MachineType } from "@/manuals/catalog";

type Message = {
  role: "user" | "assistant";
  content: string;
  image?: string;
  manualImages?: string[]; // páginas del manual que el bot enseña como ejemplo
  time: string;
  feedback?: "ok" | "nook" | "pending"; // solo en mensajes de bot
};

function now() {
  return new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

function renderMarkdown(text: string) {
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/^#{1,3} (.*)/gm, "<strong>$1</strong>")
    .replace(/^- (.*)/gm, "• $1")
    .replace(/\n/g, "<br/>");
}

const TYPES: MachineType[] = ["cafe", "frio", "snack"];

export default function App() {
  const [machineId, setMachineId] = useState<string | null>(null);
  const machine = MACHINES.find((m) => m.id === machineId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [nookIdx, setNookIdx] = useState<number | null>(null); // índice del mensaje que está dando feedback negativo
  const [nookText, setNookText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function selectMachine(id: string) {
    const m = MACHINES.find((x) => x.id === id)!;
    setMachineId(id);
    const warn = m.manualId
      ? ""
      : "\n\n⚠️ Aún no tengo el manual exacto de este modelo, te daré orientación general.";
    setMessages([
      {
        role: "assistant",
        content: `Trabajando con *${m.label}* (${TYPE_LABELS[m.type]}).${warn}\n\nDime el problema o el código de error que aparece. Puedes mandarme una foto 📷`,
        time: now(),
      },
    ]);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImageBase64(result.split(",")[1]);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function autoResize() {
    const el = textRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  async function send() {
    const text = input.trim();
    if ((!text && !imageBase64) || !machineId) return;

    const userMsg: Message = {
      role: "user",
      content: text || "📷",
      image: imagePreview ?? undefined,
      time: now(),
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    const img = imageBase64;
    setImageBase64(null);
    setImagePreview(null);
    setLoading(true);
    if (textRef.current) textRef.current.style.height = "auto";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          machineId,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          imageBase64: img,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply ?? "Sin respuesta.",
          manualImages: data.images ?? [],
          time: now(),
          feedback: "pending",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error de conexión. Inténtalo de nuevo.", time: now() },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function sendFeedbackOk(idx: number) {
    setMessages((prev) => prev.map((m, i) => i === idx ? { ...m, feedback: "ok" } : m));
  }

  function startNook(idx: number) {
    setNookIdx(idx);
    setNookText("");
  }

  async function submitNook(idx: number) {
    if (!nookText.trim() || !machineId) return;
    // El problema fue el mensaje de usuario anterior al bot
    const userMsg = messages.slice(0, idx).reverse().find((m) => m.role === "user");
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          machineId,
          problem: userMsg?.content ?? "desconocido",
          solution: nookText.trim(),
        }),
      });
    } catch { /* silencioso */ }
    setMessages((prev) => prev.map((m, i) => i === idx ? { ...m, feedback: "nook" } : m));
    setNookIdx(null);
    setNookText("");
  }

  // ── Pantalla de selección de máquina ──────────────────
  if (!machine) {
    return (
      <div className="picker-wrapper">
        <div className="picker-header">
          <div className="picker-logo">🔧</div>
          <h1>TecniBot</h1>
          <p>Asistente técnico · Serteko &amp; Talavera</p>
        </div>
        <div className="picker-body">
          <p className="picker-prompt">¿En qué máquina estás trabajando?</p>
          {TYPES.map((type) => (
            <div key={type} className="picker-group">
              <h2>{TYPE_LABELS[type]}</h2>
              {MACHINES.filter((m) => m.type === type).map((m) => (
                <button key={m.id} className="picker-item" onClick={() => selectMachine(m.id)}>
                  <span>{m.label}</span>
                  <span className="picker-arrow">›</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Pantalla de chat ──────────────────────────────────
  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <button className="back-btn" onClick={() => setMachineId(null)} title="Cambiar máquina">‹</button>
        <div className="avatar">🔧</div>
        <div className="header-info">
          <h1>TecniBot</h1>
          <p><span className="online-dot" />{machine.label}</p>
        </div>
      </div>

      <div className="messages-area">
        <div className="date-sep"><span>Hoy</span></div>
        {messages.map((msg, i) => (
          <div key={i} className={`msg-row ${msg.role === "user" ? "user" : "bot"}`}>
            <div className="bubble">
              {msg.image && <img src={msg.image} alt="foto" />}
              {msg.role === "assistant" ? (
                <span dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
              ) : (
                <span>{msg.content}</span>
              )}
              {msg.manualImages && msg.manualImages.length > 0 && (
                <div className="manual-images">
                  {msg.manualImages.map((src, j) => (
                    <a key={j} href={src} target="_blank" rel="noreferrer">
                      <img src={src} alt="Página del manual" className="manual-image" />
                    </a>
                  ))}
                </div>
              )}
              <span className="bubble-time">{msg.time}</span>

              {/* Feedback — solo en mensajes del bot con estado pending */}
              {msg.role === "assistant" && msg.feedback === "pending" && nookIdx !== i && (
                <div className="feedback-row">
                  <button className="fb-btn fb-ok" onClick={() => sendFeedbackOk(i)} title="Funcionó">👍</button>
                  <button className="fb-btn fb-nook" onClick={() => startNook(i)} title="No funcionó">👎</button>
                </div>
              )}
              {msg.role === "assistant" && msg.feedback === "ok" && (
                <div className="feedback-done">✅ Resuelto</div>
              )}
              {msg.role === "assistant" && msg.feedback === "nook" && (
                <div className="feedback-done">📚 Corrección guardada</div>
              )}

              {/* Formulario de corrección */}
              {nookIdx === i && (
                <div className="nook-form">
                  <p>¿Cuál era la solución correcta?</p>
                  <textarea
                    className="nook-input"
                    placeholder="Ej: Había que limpiar el sensor de nivel con alcohol..."
                    value={nookText}
                    onChange={(e) => setNookText(e.target.value)}
                    rows={2}
                    autoFocus
                  />
                  <div className="nook-actions">
                    <button className="nook-cancel" onClick={() => setNookIdx(null)}>Cancelar</button>
                    <button className="nook-submit" onClick={() => submitNook(i)} disabled={!nookText.trim()}>
                      Guardar corrección
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="msg-row bot">
            <div className="typing-bubble"><span /><span /><span /></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {imagePreview && (
        <div className="img-preview">
          <div style={{ position: "relative", display: "inline-flex" }}>
            <img src={imagePreview} alt="preview" />
            <button className="img-preview-remove" onClick={() => { setImagePreview(null); setImageBase64(null); }}>×</button>
          </div>
          <span className="img-preview-label">Foto lista — envía con o sin texto</span>
        </div>
      )}

      <div className="input-bar">
        <div className="input-box">
          <button className="btn-icon" onClick={() => fileRef.current?.click()} title="Foto">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleFile} />
          <textarea
            ref={textRef}
            placeholder="Describe el problema o el código..."
            rows={1}
            value={input}
            onChange={(e) => { setInput(e.target.value); autoResize(); }}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          />
        </div>
        <button className="btn-send" onClick={send} disabled={loading || (!input.trim() && !imageBase64)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
        </button>
      </div>
    </div>
  );
}
