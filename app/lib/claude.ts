import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "./system-prompt";
import { getRelevantCorrections } from "./corrections";
import { Machine, loadManual } from "@/manuals/catalog";

const apiKey = (process.env.ANTHROPIC_API_KEY ?? "").replace(/﻿/g, "").trim();
const anthropic = new Anthropic({ apiKey });

// Modelo de coste/calidad equilibrado para un asistente técnico con mucho contexto (manuales largos).
const MODEL = "claude-haiku-4-5-20251001";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export interface ChatResult {
  text: string;       // respuesta ya limpia de marcadores de imagen
  images: number[];   // páginas del manual que hay que mostrar como imagen
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// El modelo marca las páginas a mostrar como [PAGINA:N]. Las extraemos y limpiamos el texto.
function extractImageTags(text: string): ChatResult {
  const pages: number[] = [];
  const cleaned = text.replace(/\[PAGINA:(\d+)\]/g, (_, n) => {
    const num = parseInt(n, 10);
    if (!pages.includes(num)) pages.push(num);
    return "";
  }).replace(/\n{3,}/g, "\n\n").trim();

  return { text: cleaned, images: pages };
}

export async function chat(
  machine: Machine,
  history: ChatMessage[],
  userText: string,
  imageBase64?: string
): Promise<ChatResult> {
  const [manualText, corrections] = await Promise.all([
    loadManual(machine.manualId),
    getRelevantCorrections(machine.id, userText),
  ]);
  const system = buildSystemPrompt(machine, manualText, corrections);

  // Fusionar mensajes consecutivos del mismo rol y asegurar que empieza en "user"
  const merged: ChatMessage[] = [];
  for (const m of history) {
    const last = merged[merged.length - 1];
    if (last && last.role === m.role) last.content += "\n" + m.content;
    else merged.push({ ...m });
  }
  while (merged.length > 0 && merged[0].role === "assistant") merged.shift();

  type ContentBlock =
    | { type: "text"; text: string }
    | { type: "image"; source: { type: "base64"; media_type: "image/jpeg"; data: string } };

  const lastContent: ContentBlock[] = [];
  if (imageBase64) {
    lastContent.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } });
  }
  lastContent.push({ type: "text", text: userText || "Analiza esta imagen de la máquina" });

  const messages = [
    ...merged.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: lastContent },
  ];

  let lastError: unknown = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 1024,
        system,
        messages,
      });
      const textBlock = response.content.find((b) => b.type === "text");
      const text = textBlock && textBlock.type === "text" ? textBlock.text : "";
      if (text) return extractImageTags(text);
    } catch (err) {
      lastError = err;
      const msg = (err as Error)?.message ?? "";
      if (msg.includes("overloaded") || msg.includes("429") || msg.includes("529")) {
        await sleep(1000 * (attempt + 1));
        continue;
      }
      break;
    }
  }

  console.error("Claude falló:", lastError);
  throw new Error("MODEL_UNAVAILABLE");
}
