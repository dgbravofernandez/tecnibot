/**
 * scrape-errorcodes.ts
 * Scraping de bases de datos públicas de códigos de error
 *
 * Fuentes objetivo:
 * - vendingconnection.com/forum (buscar threads de error codes)
 * - manualslib.com (manuales técnicos con sección de errores)
 * - fabricantes que publican PDF públicos
 *
 * Output: archivos .md en knowledge-base/error-codes/[marca].md
 *
 * IMPORTANTE: Respetar robots.txt y rate limits. No scraping agresivo.
 */

// TODO: implementar con playwright o cheerio
// Alternativa recomendada: descargar PDFs manualmente y usar ingest-manuals.ts
// El scraping automático es frágil; mejor curation manual inicial

console.log("scrape-errorcodes.ts — usar ingest-manuals.ts con PDFs manuales primero");
