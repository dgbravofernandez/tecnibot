/**
 * ingest-manuals.ts
 * Pipeline: PDF de manual técnico → chunks → embeddings → Supabase pgvector
 *
 * Uso: npx ts-node scripts/ingest-manuals.ts --file ./knowledge-base/machines/necta/colibri/manual-tecnico.pdf
 *      npx ts-node scripts/ingest-manuals.ts --dir ./knowledge-base/machines/necta/
 */

import fs from "fs";
import path from "path";

// TODO: instalar dependencias
// npm install pdf-parse @supabase/supabase-js openai commander

interface ChunkMetadata {
  brand: string;
  model: string;
  system: string;
  symptom: string;
  source: string;
  page: number;
  confidence: "high" | "medium" | "low";
  language: string;
}

interface Chunk {
  content: string;
  metadata: ChunkMetadata;
  embedding?: number[];
}

/**
 * Extrae texto de un PDF página a página
 * Retorna array de {pageNum, text}
 */
async function extractPdfPages(
  filePath: string
): Promise<{ pageNum: number; text: string }[]> {
  // TODO: implementar con pdf-parse o Unstructured.io
  // const pdfParse = require('pdf-parse')
  // const buffer = fs.readFileSync(filePath)
  // const data = await pdfParse(buffer)
  throw new Error("Not implemented: instalar pdf-parse");
}

/**
 * Divide texto en chunks de máximo maxTokens
 * Respeta párrafos y pasos numerados
 */
function chunkText(text: string, maxTokens = 500): string[] {
  // Dividir por doble salto de línea (párrafos)
  const paragraphs = text.split(/\n\n+/);
  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    // Estimación: 1 token ≈ 4 caracteres
    if ((current + para).length / 4 > maxTokens) {
      if (current) chunks.push(current.trim());
      current = para;
    } else {
      current += (current ? "\n\n" : "") + para;
    }
  }
  if (current) chunks.push(current.trim());
  return chunks.filter((c) => c.length > 50);
}

/**
 * Genera embeddings usando OpenAI text-embedding-3-small
 * o Voyage AI como alternativa más barata
 */
async function generateEmbedding(text: string): Promise<number[]> {
  // TODO: implementar con openai
  // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  // const response = await openai.embeddings.create({
  //   model: 'text-embedding-3-small',
  //   input: text,
  // })
  // return response.data[0].embedding
  throw new Error("Not implemented: configurar OPENAI_API_KEY");
}

/**
 * Sube chunks con embeddings a Supabase pgvector
 * Tabla: knowledge_chunks (id, content, metadata, embedding)
 */
async function upsertToSupabase(chunks: Chunk[]): Promise<void> {
  // TODO: implementar con supabase-js
  // const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
  // await supabase.from('knowledge_chunks').upsert(
  //   chunks.map(c => ({ content: c.content, metadata: c.metadata, embedding: c.embedding }))
  // )
  console.log(`[TODO] Subir ${chunks.length} chunks a Supabase`);
}

/**
 * Pipeline completo para un PDF
 */
async function ingestPdf(
  filePath: string,
  metadata: Partial<ChunkMetadata>
): Promise<void> {
  console.log(`Procesando: ${filePath}`);

  const pages = await extractPdfPages(filePath);
  const allChunks: Chunk[] = [];

  for (const { pageNum, text } of pages) {
    const textChunks = chunkText(text);
    for (const content of textChunks) {
      allChunks.push({
        content,
        metadata: {
          brand: metadata.brand ?? "unknown",
          model: metadata.model ?? "unknown",
          system: metadata.system ?? "general",
          symptom: metadata.symptom ?? "general",
          source: path.basename(filePath),
          page: pageNum,
          confidence: metadata.confidence ?? "high",
          language: metadata.language ?? "es",
        },
      });
    }
  }

  console.log(`Generando embeddings para ${allChunks.length} chunks...`);
  for (const chunk of allChunks) {
    chunk.embedding = await generateEmbedding(chunk.content);
  }

  await upsertToSupabase(allChunks);
  console.log(`✓ Ingestados ${allChunks.length} chunks de ${filePath}`);
}

// Entry point
// TODO: parsear args con commander y llamar ingestPdf
console.log("Script de ingestión de manuales — pendiente de implementación");
console.log("Ver TODO comments para completar");
