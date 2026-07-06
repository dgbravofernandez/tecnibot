# Symptoms — Entrada por Problema Observable

## Propósito

El usuario describe lo que VE o lo que NO funciona, no el componente técnico.
Esta carpeta organiza el conocimiento desde la perspectiva del usuario final.

## Síntomas cubiertos (V1)

| Carpeta | Descripción usuario | Subsistemas relacionados |
|---------|--------------------|-----------------------|
| `no-enfria/` | "No enfría", "bebidas calientes", "temperatura alta" | refrigeracion |
| `no-dispensar/` | "No cae el producto", "se atasca", "selección no responde" | dispensador |
| `pago-fallo/` | "No acepta monedas", "no lee el billete", "no devuelve cambio" | pago |
| `pantalla-error/` | "Sale un código", "pantalla parpadeante", "no arranca" | software, electricidad |
| `ruido-anomalo/` | "Hace ruido raro", "vibra mucho", "pitidos" | refrigeracion, dispensador |
| `fuga-agua/` | "Gotea", "hay agua en el suelo", "humedad interior" | refrigeracion |

## Estructura de cada síntoma

```
no-enfria/
├── _context.md          — árbol de decisión resumido del síntoma
├── causas-comunes.md    — top 5 causas ordenadas por frecuencia
├── pasos-diagnostico.md — protocolo paso a paso
└── cuando-escalar.md    — señales de que necesita técnico SAT
```

## Formato del árbol de decisión en _context.md

```
¿La máquina enciende? 
  NO → ver electricidad/no-arranca
  SÍ → ¿El compresor arranca?
         NO → [causa: compresor, termostato, gas]
         SÍ → ¿El ventilador funciona?
                NO → [causa: motor ventilador]
                SÍ → [causa: gas bajo, suciedad condensador]
```

## Tip para el RAG

Cuando el usuario describe un síntoma en lenguaje natural, el sistema debe:
1. Identificar el síntoma slug más cercano
2. Combinar query: síntoma + marca/modelo si disponible
3. Priorizar chunks con confidence: high de esa combinación
