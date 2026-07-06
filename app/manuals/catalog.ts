// Catálogo de máquinas basado en el inventario real Serteko & Talavera (240 máquinas)
// Cada máquina mapea a: tipo de máquina + manual disponible

export type MachineType = "cafe" | "frio" | "snack";

export interface Machine {
  id: string;
  label: string;        // nombre que ve el usuario
  type: MachineType;    // cafe=calienta, frio=enfría, snack=dispensa
  manualId: string | null; // id del manual en manuals/data/, o null si no hay
  aliases: string[];    // variantes del inventario para detección por texto
}

export const MACHINES: Machine[] = [
  // ── CAFÉ (calientan agua, NUNCA enfrían) ──────────────────
  {
    id: "saeco-cristallo",
    label: "Saeco Cristallo 400 / 600 / EVO",
    type: "cafe",
    manualId: "saeco-cristallo",
    aliases: ["cristallo", "cristalo", "crislallo", "cristallo evo", "cristalo 400", "cristalo 600", "oasi 400", "cristallo oasis", "cristallo zafiro"],
  },
  {
    id: "saeco-dap",
    label: "Saeco DAP 7 / 8 Plus",
    type: "cafe",
    manualId: "saeco-dap",
    aliases: ["dap 7", "dap 8", "dap7", "dap8", "dap plus"],
  },
  {
    id: "saeco-atlante",
    label: "Saeco Atlante (Gran Gusto / 500)",
    type: "cafe",
    manualId: "saeco-atlante",
    aliases: ["atlante", "atlante 500", "atlante gran gusto"],
  },
  {
    id: "saeco-diamante",
    label: "Saeco Diamante Combi",
    type: "cafe",
    manualId: "saeco-diamante",
    aliases: ["diamante", "diamante combi"],
  },
  {
    id: "saeco-breakpoint",
    label: "Saeco Break Point",
    type: "cafe",
    manualId: "saeco-breakpoint",
    aliases: ["break point", "breakpoint", "break-point"],
  },
  {
    id: "rubino",
    label: "Rubino 200 (Group / Black-Lio)",
    type: "cafe",
    manualId: "rubino",
    aliases: ["rubino", "rubino 200", "rubino group", "black-lio", "blac-lio"],
  },
  {
    id: "saeco-otra-cafe",
    label: "Otra Saeco café (Zaffiro, Smeraldo…)",
    type: "cafe",
    manualId: null, // sin manual extraído todavía
    aliases: ["zaffiro", "zafiro", "smeraldo", "esmeralda"],
  },

  // ── FRÍO (enfrían, NUNCA calientan) ───────────────────────
  {
    id: "saeco-artic",
    label: "Saeco Artic 272 (refrescos)",
    type: "frio",
    manualId: null, // manual escaneado, pendiente OCR
    aliases: ["artic", "artic 272", "ártic"],
  },
  {
    id: "fas-krystal",
    label: "FAS Krystal (refrescos)",
    type: "frio",
    manualId: null,
    aliases: ["krystal", "fas krystal"],
  },

  // ── SNACK / MIXTAS (dispensan producto) ───────────────────
  {
    id: "azkoyen-palma",
    label: "Azkoyen Palma (H / HZ / Combi / B)",
    type: "snack",
    manualId: "azkoyen-palma-prog",
    aliases: ["azkoyen", "azcoyen", "palma", "palma h", "palma hz", "palma combi", "palma b", "palma office", "husimat"],
  },
  {
    id: "fas-everest",
    label: "FAS Everest L",
    type: "snack",
    manualId: "fas-everest",
    aliases: ["everest", "fas everest", "panzer"],
  },
  {
    id: "fas-1050",
    label: "FAS 900 / 1050",
    type: "snack",
    manualId: "fas-1050",
    aliases: ["fas 1050", "fas 900", "fast 900", "fast 1050"],
  },
  {
    id: "jofemar-vision",
    label: "Jofemar Vision Snack Plus",
    type: "snack",
    manualId: "jofemar-vision",
    aliases: ["jofemar", "vision", "vision snack"],
  },
];

export const TYPE_LABELS: Record<MachineType, string> = {
  cafe: "☕ Café (calienta)",
  frio: "❄️ Refrescos (enfría)",
  snack: "🍫 Snacks (dispensa)",
};

export function findMachine(id: string): Machine | undefined {
  return MACHINES.find((m) => m.id === id);
}

/** Detecta máquina por texto libre (para Telegram) */
export function detectMachine(text: string): Machine | undefined {
  const t = text.toLowerCase();
  for (const m of MACHINES) {
    if (m.aliases.some((a) => t.includes(a))) return m;
  }
  return undefined;
}

/** Carga el texto del manual de forma diferida */
export async function loadManual(manualId: string | null): Promise<string | null> {
  if (!manualId) return null;
  try {
    const mod = await import(`./data/${manualId}.ts`);
    return mod.default as string;
  } catch {
    return null;
  }
}
