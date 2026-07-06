# Maintenance — Mantenimiento Preventivo

## Propósito

Guías de mantenimiento periódico para evitar averías. El bot las usa cuando
el usuario pregunta "¿qué mantenimiento necesita mi máquina?" o como
contexto adicional al diagnosticar problemas por falta de mantenimiento.

## Archivos

- `semanal.md` — revisiones cada semana (limpieza superficial, verificación visual)
- `mensual.md` — revisiones mensuales (filtros, serpentín, validadores)
- `anual.md` — mantenimiento anual (gas, compresor, rodamientos, firmware)
- `limpieza.md` — protocolos de limpieza profunda (requerido por sanidad en ES)

## Relación mantenimiento-avería

Esta tabla ayuda al bot a correlacionar problemas con mantenimiento omitido:

| Avería frecuente | Causa mantenimiento | Prevención |
|-----------------|--------------------|-----------| 
| No enfría bien | Condensador sucio | Limpiar cada 3 meses |
| Atascos dispensador | Polvo en espirales | Limpiar mensual |
| Fallo validador moneda | Suciedad interior | Limpiar cada 2 meses |
| Ruido compresor | Falta lubricación | Revisión anual SAT |
| Fuga agua | Desagüe obstruido | Revisar mensual |

## Normativa aplicable (España)

- Real Decreto 3484/2000 — manipulación de alimentos en máquinas
- Limpieza desinfección mínimo cada 15 días (productos alimentarios)
- Registro de limpiezas obligatorio para inspecciones sanitarias

## Cómo el bot usa esta información

Cuando diagnostica un problema, si el historial de mantenimiento es relevante
el bot debe preguntar: "¿Cuándo fue la última limpieza del condensador?"
y cruzar la respuesta con los intervalos recomendados.
