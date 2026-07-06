/**
 * build-embeddings.ts
 * Re-genera embeddings de toda la KB o de chunks sin embedding
 * Útil para: migrar modelo de embeddings, re-indexar tras cambios masivos
 *
 * Uso: npx ts-node scripts/build-embeddings.ts --all
 *      npx ts-node scripts/build-embeddings.ts --missing   (solo los que faltan)
 */

// TODO: implementar consulta a Supabase → chunks sin embedding → batch generate → update
// Batch size recomendado: 100 chunks por llamada a OpenAI (límite rate)
// Coste estimado: ~$0.02 por cada 1000 chunks con text-embedding-3-small

console.log("build-embeddings.ts — pendiente de implementación");
