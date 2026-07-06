# Knowledge Base — Contexto para Claude Code e Indexación

## Qué es esta carpeta

Aquí vive toda la documentación técnica que el chatbot consulta via RAG.
Cada subcarpeta tiene su propio `_context.md` que explica su contenido y uso.

## Formato estándar de documento KB

Todos los archivos `.md` de conocimiento deben usar este frontmatter:

```yaml
---
brand: necta                        # marca de la máquina
model: Colibri                      # modelo (o "all" si aplica a toda la marca)
system: refrigeration               # subsistema: refrigeration|payment|dispensing|electrical|software|general
symptom: no-cooling                 # síntoma principal (slug del directorio symptoms/)
source: manual-tecnico-necta-v2.pdf # origen del documento
page: 47                            # página del PDF original (si aplica)
confidence: high                    # high|medium|low (high = manual oficial, low = foro)
language: es                        # es|en
tags: [compresor, gas, temperatura] # palabras clave adicionales para RAG
---
```

## Jerarquía de confianza de fuentes

1. **high** — Manuales técnicos oficiales del fabricante (PDF directo del fabricante)
2. **high** — Manuales de servicio con esquemas eléctricos (SAT certificados)
3. **medium** — Bases de datos de error codes de la marca
4. **medium** — Foros técnicos verificados (vendingconnection.com, vendingworld.es)
5. **low** — Casos resueltos del propio chatbot con feedback positivo
6. **low** — YouTube tutoriales con autor identificado

## Reglas de chunking para indexación

- Máximo 500 tokens por chunk
- Cada chunk debe ser autocontenido (no depender del chunk anterior)
- Los pasos numerados mantienen el orden intacto dentro del chunk
- Los códigos de error van en chunks propios: 1 error = 1 chunk
- Tablas de especificaciones → 1 fila por chunk con cabecera repetida

## Cómo añadir nuevo contenido

1. Colocar el PDF en la carpeta de marca correspondiente (`machines/[marca]/`)
2. Ejecutar `scripts/ingest-manuals.ts` con el path del PDF
3. El script: extrae texto → divide en chunks → genera embeddings → sube a Supabase
4. Verificar en Supabase que los chunks tienen los metadatos correctos

## Subcarpetas y su propósito

| Carpeta | Entrada por | Uso |
|---------|-------------|-----|
| `machines/` | Marca/modelo | Cuando el usuario sabe su máquina |
| `symptoms/` | Problema visible | Cuando el usuario describe qué ve |
| `error-codes/` | Código exacto | Lookup directo → solución |
| `systems/` | Subsistema técnico | Para diagnóstico técnico avanzado |
| `parts/` | Nombre de pieza | Para identificar y pedir repuestos |
| `maintenance/` | Periodicidad | Para mantenimiento preventivo |
