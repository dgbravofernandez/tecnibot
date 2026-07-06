import { NextRequest, NextResponse } from "next/server";
import { saveCorrection } from "@/lib/corrections";

export async function POST(req: NextRequest) {
  try {
    const { machineId, problem, solution } = await req.json();

    if (!machineId || !problem || !solution) {
      return NextResponse.json({ ok: false, error: "Faltan campos" }, { status: 400 });
    }

    const result = await saveCorrection({ machineId, problem, solution });
    return NextResponse.json(result);
  } catch (err) {
    console.error("feedback error:", err);
    return NextResponse.json({ ok: false, error: "Error interno" }, { status: 500 });
  }
}
