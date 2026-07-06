# VendingBot — Técnico Senior Virtual de Máquinas Expendedoras

## Propósito del Proyecto

Chatbot de diagnóstico y mantenimiento técnico paso a paso para máquinas expendedoras.
El objetivo es que cualquier persona sin conocimientos técnicos pueda resolver o entender
un problema de máquina expendedora guiada por el bot.

## Stack

```
Framework:    Next.js 15 (App Router) + TypeScript
Auth:         Supabase Auth
Database:     Supabase PostgreSQL + pgvector (RAG)
AI:           Claude claude-sonnet-4-6 (chat + visión)
Embeddings:   text-embedding-3-small (OpenAI) o voyage-2
PDF ingest:   Unstructured.io o pdf-parse
Deploy:       Vercel
```

## Estructura del Proyecto

```
knowledge-base/     — Toda la documentación técnica indexable
diagnostic-flows/   — Árboles de decisión y scripts de resolución
prompts/            — System prompts y prompts por agente
scripts/            — Automatizaciones: ingestión, embeddings, scraping
app/                — Frontend Next.js del chatbot
```

## Convenciones

- Los archivos `_CONTEXT.md` en cada carpeta explican a Claude cómo usar ese directorio
- Los archivos de KB llevan frontmatter YAML con metadatos de indexación
- Todos los prompts están en `prompts/` y se versionan como código
- Nunca hardcodear marcas o modelos en el código — todo va en la KB

## Flujo de Diagnóstico

1. Triage → marca/modelo/síntoma (intake-questions.md)
2. Input del usuario → texto, foto, código de error, tipo test
3. RAG query → buscar en KB con metadatos relevantes
4. Respuesta paso a paso → numerada y verificable
5. Feedback → ¿resuelto? 👍/👎 → guardar en Supabase

## Marcas Cubiertas (V1)

Necta, Crane, FAS, Jofemar, Wurlitzer, Sielaff

## Reglas Críticas

- SIEMPRE advertir antes de pasos con riesgo eléctrico
- Si no hay información en KB → decir explícitamente, no inventar
- Si el problema supera nivel usuario → escalar a técnico SAT certificado
- Los codes de error son lookup directo, no inferencia
