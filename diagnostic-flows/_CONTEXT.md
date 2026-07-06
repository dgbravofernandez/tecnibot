# Diagnostic Flows — Árboles de Decisión y Scripts de Resolución

## Propósito

Esta carpeta contiene la lógica de conversación del bot: cómo guiar al usuario
desde "tengo un problema" hasta "está resuelto" de forma sistemática.

## Estructura

```
diagnostic-flows/
├── intake-questions.md    — Las 5 preguntas de triage inicial (SIEMPRE primero)
├── symptom-trees/         — Árbol de decisión por síntoma (1 archivo por síntoma)
└── resolution-scripts/    — Guías paso a paso verificadas para problemas conocidos
```

## Cómo funciona el flujo

```
Usuario describe problema
        ↓
intake-questions.md → recopilar: marca, modelo, síntoma, código error, intentos previos
        ↓
symptom-trees/[síntoma].md → árbol de decisión adaptativo con preguntas
        ↓
RAG query → buscar en KB con contexto completo
        ↓
resolution-scripts/[problema-resuelto].md → si existe script verificado, usarlo
        ↓
Respuesta paso a paso → numerada, con checkpoints ("¿ves X?")
        ↓
Feedback → ¿resuelto? → si SÍ: guardar como caso resuelto en KB
                      → si NO: escalar a técnico o abrir nuevo árbol
```

## Formato de árbol de decisión (symptom-trees/)

```markdown
# Árbol: No Enfría

## Checkpoint 0 — ¿La máquina tiene corriente?
- [ ] Comprobar que el piloto/pantalla enciende
- NO enciende → [ir a electricidad/no-arranca]
- SÍ enciende → Checkpoint 1

## Checkpoint 1 — ¿El compresor arranca?
Escuchar: debe haber zumbido continuo en la parte trasera-inferior
- NO se oye nada → [causa probable: termostato, relé, compresor]
- SÍ se oye → Checkpoint 2

## Checkpoint 2 — ¿El ventilador del condensador gira?
...
```

## Formato de script de resolución (resolution-scripts/)

```markdown
# Resolución: Condensador Sucio → No Enfría

**Tiempo estimado:** 20-30 minutos  
**Herramientas:** aspirador, cepillo suave, guantes  
**Riesgo eléctrico:** DESCONECTAR antes de limpiar  
**Confirmación resolución:** temperatura baja 3-5°C en 30 min

## Pasos

1. **DESCONECTAR** la máquina de la corriente (obligatorio)
2. Localizar el condensador: rejilla metálica en la parte trasera o inferior
3. Aspirar el polvo con boquilla fina, movimientos verticales
4. Limpiar con cepillo suave si hay acumulación
5. Reconectar y esperar 30 minutos
6. Verificar temperatura: debe bajar. Si no baja → gas bajo (llamar SAT)
```
