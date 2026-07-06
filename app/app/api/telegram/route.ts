import { NextRequest, NextResponse } from "next/server";
import { chat, ChatMessage } from "@/lib/claude";
import { sendMessage, sendPhoto, sendTyping, downloadPhoto } from "@/lib/telegram";
import { detectMachine, Machine, MACHINES, TYPE_LABELS } from "@/manuals/catalog";
import { saveCorrection } from "@/lib/corrections";

// Estado por chat: máquina seleccionada + historial + último intercambio para feedback
type Session = {
  machine?: Machine;
  history: ChatMessage[];
  lastBotReply?: string;       // para guardar la respuesta del bot (feedback /nook)
  lastUserProblem?: string;    // el problema que el usuario describió
};
const sessions = new Map<number, Session>();

function machineMenu(): string {
  const lines = MACHINES.map((m, i) => `${i + 1}. ${m.label}`);
  return (
    "¿En qué máquina estás trabajando? Responde con el *número* o escribe el modelo:\n\n" +
    lines.join("\n")
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message;
    if (!message) return NextResponse.json({ ok: true });

    const chatId: number = message.chat.id;
    const text: string = (message.text ?? message.caption ?? "").trim();
    const photos = message.photo as { file_id: string }[] | undefined;

    const session = sessions.get(chatId) ?? { history: [] };

    // Comando /start o /cambiar → resetear y mostrar menú
    if (text === "/start" || text === "/cambiar") {
      sessions.set(chatId, { history: [] });
      await sendMessage(
        chatId,
        "🔧 TecniBot — tu técnico de máquinas expendedoras.\n\n" + machineMenu()
      );
      return NextResponse.json({ ok: true });
    }

    // /ok → confirmar que la solución funcionó (feedback positivo, no guarda nada)
    if (text === "/ok") {
      await sendMessage(chatId, "✅ Perfecto, me alegra que se haya resuelto. Para otro problema: /cambiar");
      return NextResponse.json({ ok: true });
    }

    // /nook [solución real] → guardar corrección verificada
    if (text.startsWith("/nook")) {
      const realSolution = text.replace("/nook", "").trim();
      if (!realSolution) {
        await sendMessage(
          chatId,
          "Cuéntame cuál era la solución real:\n/nook [escribe aquí la solución que funcionó]\n\nEjemplo: /nook Había que limpiar el sensor de nivel de agua con alcohol"
        );
        return NextResponse.json({ ok: true });
      }
      if (session.machine && session.lastUserProblem) {
        await saveCorrection({
          machineId: session.machine.id,
          problem: session.lastUserProblem,
          solution: realSolution,
        });
        await sendMessage(
          chatId,
          "📚 Anotado. Esa corrección queda guardada y la próxima vez que alguien reporte el mismo problema la usaré directamente.\n\nGracias por enseñarme! 🙏"
        );
      } else {
        await sendMessage(chatId, "No encontré el problema anterior. Describe el problema y la solución:\n/nook [problema] → [solución]");
      }
      return NextResponse.json({ ok: true });
    }

    // Si no hay máquina seleccionada, intentar seleccionarla
    if (!session.machine) {
      // ¿Eligió por número?
      const num = parseInt(text, 10);
      let chosen: Machine | undefined;
      if (!isNaN(num) && num >= 1 && num <= MACHINES.length) {
        chosen = MACHINES[num - 1];
      } else {
        chosen = detectMachine(text);
      }

      if (chosen) {
        session.machine = chosen;
        session.history = [];
        sessions.set(chatId, session);
        await sendMessage(
          chatId,
          `✅ Trabajando con: *${chosen.label}* (${TYPE_LABELS[chosen.type]})\n\nCuéntame el problema o el código de error que aparece. Puedes mandarme una foto.`
        );
        return NextResponse.json({ ok: true });
      }

      // No identificada → mostrar menú
      await sendMessage(chatId, machineMenu());
      return NextResponse.json({ ok: true });
    }

    // Ya hay máquina → conversación normal
    await sendTyping(chatId);

    let imageBase64: string | undefined;
    if (photos?.length) {
      imageBase64 = await downloadPhoto(photos[photos.length - 1].file_id);
    }

    const result = await chat(session.machine, session.history, text, imageBase64);

    session.history.push({ role: "user", content: text || "(foto)" });
    session.history.push({ role: "assistant", content: result.text });
    session.history = session.history.slice(-20);
    // Guardar último intercambio para feedback
    session.lastUserProblem = text || "(foto)";
    session.lastBotReply = result.text;
    sessions.set(chatId, session);

    await sendMessage(chatId, result.text + "\n\n¿Funcionó? Responde /ok si sí, o /nook [solución real] si no.");

    // Enviar las páginas del manual referenciadas como fotos
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");
    for (const page of result.images) {
      const photoUrl = `${appUrl}/manuals-images/${session.machine.manualId}/${page}.jpg`;
      await sendPhoto(chatId, photoUrl, `Página ${page} del manual`);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: true });
  }
}
