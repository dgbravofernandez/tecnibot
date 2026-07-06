/**
 * setup-telegram.ts
 * Registra el webhook de Telegram apuntando a tu URL de Vercel.
 *
 * Uso: npx ts-node scripts/setup-telegram.ts
 * Requiere: TELEGRAM_BOT_TOKEN y NEXT_PUBLIC_APP_URL en .env.local
 */

import * as fs from "fs";
import * as path from "path";

// Leer .env.local manualmente
const envPath = path.join(__dirname, "../.env.local");
if (!fs.existsSync(envPath)) {
  console.error("❌ No existe .env.local — copia .env.local.example y rellénalo primero");
  process.exit(1);
}
const env = Object.fromEntries(
  fs.readFileSync(envPath, "utf-8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => l.split("=").map((s) => s.trim()) as [string, string])
);

const TOKEN = env["TELEGRAM_BOT_TOKEN"];
const APP_URL = env["NEXT_PUBLIC_APP_URL"];

if (!TOKEN || TOKEN.includes("...")) {
  console.error("❌ TELEGRAM_BOT_TOKEN no configurado");
  process.exit(1);
}
if (!APP_URL || APP_URL.includes("tu-app")) {
  console.error("❌ NEXT_PUBLIC_APP_URL no configurado (debe ser la URL real de Vercel)");
  process.exit(1);
}

const webhookUrl = `${APP_URL}/api/telegram`;

async function main() {
  console.log(`Registrando webhook: ${webhookUrl}`);

  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: webhookUrl }),
  });

  const data = await res.json();
  if (data.ok) {
    console.log("✅ Webhook registrado correctamente");
    console.log(`   URL: ${webhookUrl}`);
  } else {
    console.error("❌ Error:", data.description);
  }

  // Verificar info del bot
  const infoRes = await fetch(`https://api.telegram.org/bot${TOKEN}/getMe`);
  const info = await infoRes.json();
  if (info.ok) {
    console.log(`\n🤖 Bot activo: @${info.result.username}`);
    console.log(`   Busca tu bot en Telegram como: @${info.result.username}`);
  }
}

main();
