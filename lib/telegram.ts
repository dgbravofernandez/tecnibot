// Limpia BOM y espacios de env vars (PowerShell pipe puede añadir BOM)
const token = (process.env.TELEGRAM_BOT_TOKEN ?? "").replace(/﻿/g, "").trim();
const BASE = `https://api.telegram.org/bot${token}`;

export async function sendMessage(chatId: number, text: string) {
  // Limpiar BOM/control y convertir markdown a texto plano legible
  const clean = text
    .replace(/﻿/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1") // **negrita** → negrita
    .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, "$1") // *cursiva* → cursiva
    .replace(/`(.*?)`/g, "$1")
    .replace(/^#{1,3}\s+/gm, "") // ## títulos
    .trim();

  // Telegram tiene límite de 4096 caracteres por mensaje
  const chunks = clean.match(/[\s\S]{1,4000}/g) ?? [clean];
  for (const chunk of chunks) {
    await fetch(`${BASE}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: chunk }),
    });
  }
}

export async function sendPhoto(chatId: number, photoUrl: string, caption?: string) {
  await fetch(`${BASE}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, photo: photoUrl, caption }),
  });
}

export async function sendTyping(chatId: number) {
  await fetch(`${BASE}/sendChatAction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, action: "typing" }),
  });
}

export async function downloadPhoto(fileId: string): Promise<string> {
  const fileRes = await fetch(`${BASE}/getFile?file_id=${fileId}`);
  const fileData = await fileRes.json();
  const filePath = fileData.result.file_path;
  const photoRes = await fetch(
    `https://api.telegram.org/file/bot${token}/${filePath}`
  );
  const buffer = await photoRes.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}
