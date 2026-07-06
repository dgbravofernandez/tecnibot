# Árbol de Decisión: No Enfría / Temperatura Alta

**Síntoma slug:** `no-enfria`  
**Subsistemas implicados:** refrigeracion  
**Tiempo diagnóstico estimado:** 10-20 minutos  
**Herramientas útiles:** termómetro de cocina (opcional)

---

## CHECKPOINT 0 — Verificación básica

> Preguntar al usuario: "¿La máquina enciende? ¿Hay luz o pantalla activa?"

- **NO enciende en absoluto** → [ir a síntoma: no-enciende / electricidad]
- **SÍ enciende** → Checkpoint 1

---

## CHECKPOINT 1 — ¿Hay código de error?

> "¿Ves algún código de error en la pantalla? (ej: E001, E003...)"

- **SÍ hay código** → lookup en `error-codes/[marca].md` → dar solución directa
- **NO hay código** → Checkpoint 2

---

## CHECKPOINT 2 — ¿El compresor arranca?

> "Ve a la parte trasera o inferior de la máquina. ¿Escuchas un zumbido continuo o 
> intermitente? El compresor suena como un pequeño motor."

- **NO se oye nada** → Checkpoint 2A (compresor no arranca)
- **SÍ se oye zumbido** → Checkpoint 3

### Checkpoint 2A — Compresor no arranca
> "¿Cuándo fue la última vez que funcionó bien?"

- **Paró de repente** → causa probable: relé térmico de sobrecarga disparado
  - Acción: esperar 30 min que se enfríe, reiniciar. Si no arranca → SAT
- **Progresivo** → causa probable: gas bajo o compresor deteriorado → SAT

---

## CHECKPOINT 3 — ¿El ventilador del condensador gira?

> "Mira la rejilla posterior (o inferior) de la máquina. ¿Hay un ventilador girando?
> Acerca la mano con cuidado: ¿notas que sale aire?"

- **NO gira / no sale aire** → causa: motor ventilador condensador
  - Acción: revisar conexión del motor ventilador. Sustituir si está quemado.
- **SÍ gira** → Checkpoint 4

---

## CHECKPOINT 4 — Estado del condensador

> "¿Cuándo fue la última limpieza del condensador? (La rejilla metálica trasera)"

- **Nunca / hace más de 3 meses** → causa MÁS PROBABLE: condensador obstruido
  - Solución: `resolution-scripts/limpiar-condensador.md`
- **Limpio recientemente** → Checkpoint 5

---

## CHECKPOINT 5 — Gas refrigerante

Si llegamos aquí: compresor arranca, ventilador gira, condensador limpio y sigue sin enfriar.

> "El problema es probablemente gas refrigerante bajo. Esto requiere técnico SAT certificado."

- Activar prompt de escalación: `prompts/escalation.md`
- Dar resumen técnico para el SAT:
  - Compresor: arranca ✓
  - Ventilador condensador: gira ✓  
  - Condensador: limpio ✓
  - Diagnóstico probable: gas refrigerante bajo o pérdida

---

## Causas por frecuencia (todas las marcas)

1. **Condensador sucio** (40% casos) — solución: limpieza
2. **Gas refrigerante bajo** (25% casos) — requiere SAT
3. **Ventilador condensador parado** (15% casos) — sustituir motor
4. **Relé térmico disparado** (10% casos) — resetear o sustituir
5. **Sensor temperatura defectuoso** (7% casos) — sustituir NTC
6. **Compresor averiado** (3% casos) — SAT, reparación mayor
