import { NextRequest, NextResponse } from "next/server";
import { chat, ChatMessage } from "@/lib/claude";
import { findMachine } from "@/manuals/catalog";

export async function POST(req: NextRequest) {
  try {
    const { messages, imageBase64, machineId } = await req.json();

    const machine = findMachine(machineId);
    if (!machine) {
      return NextResponse.json(
        { reply: "⚠️ Selecciona primero tu máquina." },
        { status: 200 }
      );
    }

    const history: ChatMessage[] = messages.slice(0, -1).map(
      (m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })
    );

    const lastMessage = messages[messages.length - 1];
    const result = await chat(machine, history, lastMessage?.content ?? "", imageBase64);

    const imageUrls = result.images.map((p) => `/manuals-images/${machine.manualId}/${p}.jpg`);
    return NextResponse.json({ reply: result.text, images: imageUrls });
  } catch (err) {
    console.error(err);
    const msg = (err as Error)?.message ?? "";
    const userMessage =
      msg === "MODEL_UNAVAILABLE"
        ? "⚠️ El servicio de IA está saturado ahora mismo. Inténtalo de nuevo en unos segundos."
        : "⚠️ Error al procesar la consulta. Inténtalo de nuevo.";
    return NextResponse.json({ reply: userMessage }, { status: 200 });
  }
}
