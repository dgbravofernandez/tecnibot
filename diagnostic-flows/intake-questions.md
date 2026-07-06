# Intake Questions — Triage Inicial

El bot SIEMPRE hace estas preguntas antes de dar cualquier diagnóstico.
El orden importa: cada respuesta filtra las siguientes preguntas.

## Pregunta 1 — Identificación de máquina

> "¿Qué marca y modelo es tu máquina expendedora?"

**Si no saben el modelo:**
> "No pasa nada. ¿Puedes hacerle una foto a la placa que hay en el lateral o interior
> de la máquina? Suele poner marca, modelo y número de serie."

**Respuestas esperadas:** Necta Colibri / Crane 968 / "no sé" / [foto]

---

## Pregunta 2 — Síntoma principal (tipo test)

> "¿Cuál de estos describe mejor el problema?"

Mostrar como botones/opciones:
- [ ] No enfría / bebidas calientes
- [ ] No dispensa / producto no cae
- [ ] Problema con el pago (monedas, billetes, tarjeta)
- [ ] Error en pantalla / código de error
- [ ] Hace un ruido raro
- [ ] Fuga de agua
- [ ] No enciende / pantalla apagada
- [ ] Otro (describir)

---

## Pregunta 3 — Código de error (condicional)

Solo si eligió "Error en pantalla":
> "¿Puedes decirme el código exacto que aparece? (ej: E042, F12, A3...)
> Si puedes, manda una foto de la pantalla."

---

## Pregunta 4 — Temporalidad

> "¿Cuándo empezó el problema?"

- De repente (funcionaba bien y paró)
- Progresivo (cada vez peor)
- Después de un mantenimiento o limpieza
- Siempre ha tenido este problema
- No sé

---

## Pregunta 5 — Intentos previos

> "¿Has intentado algo para solucionarlo?"

- Reiniciar la máquina
- Revisar el enchufe / corriente
- Llamar al técnico (¿qué dijo?)
- Nada todavía

---

## Con estas 5 respuestas el bot tiene suficiente contexto para:

1. Hacer una RAG query específica: `marca + modelo + síntoma + código`
2. Abrir el árbol de decisión correcto en `symptom-trees/`
3. Dar el primer diagnóstico con ≥80% de probabilidad de acierto

## Casos especiales

- **Solo foto sin texto:** analizar con Claude Vision → inferir síntoma → continuar flujo
- **Solo código de error:** ir directo a `error-codes/[marca].md` → lookup → solución
- **Usuario muy técnico:** puede saltar preguntas, el bot adapta el nivel de detalle
- **Usuario sin conocimientos:** más checkpoints visuales, más "¿ves esto?"
