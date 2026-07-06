import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Correction {
  id: string;
  machine_id: string;
  keywords: string;
  problem: string;
  solution: string;
  created_at: string;
}

/** Carga las correcciones verificadas para una máquina concreta. */
export async function getCorrections(machineId: string): Promise<Correction[]> {
  const { data, error } = await supabase
    .from("bot_corrections")
    .select("id, machine_id, keywords, problem, solution, created_at")
    .eq("machine_id", machineId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("corrections fetch error:", error.message);
    return [];
  }
  return data ?? [];
}

/** Guarda una nueva corrección de técnico. */
export async function saveCorrection(params: {
  machineId: string;
  problem: string;
  solution: string;
}): Promise<{ ok: boolean; error?: string }> {
  // Extraer palabras clave del problema para matching futuro
  const keywords = params.problem
    .toLowerCase()
    .replace(/[^a-záéíóúüñ0-9\s]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 10)
    .join(" ");

  const { error } = await supabase.from("bot_corrections").insert({
    machine_id: params.machineId,
    keywords,
    problem: params.problem,
    solution: params.solution,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/**
 * Devuelve las correcciones relevantes para un query concreto.
 * Filtra por palabras en común con el texto del usuario.
 */
export async function getRelevantCorrections(
  machineId: string,
  userText: string
): Promise<Correction[]> {
  const all = await getCorrections(machineId);
  if (!all.length) return [];

  const queryWords = userText
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);

  // Puntuar cada corrección por coincidencia de palabras
  const scored = all.map((c) => {
    const corrWords = (c.keywords + " " + c.problem).toLowerCase();
    const score = queryWords.filter((w) => corrWords.includes(w)).length;
    return { ...c, score };
  });

  return scored
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
