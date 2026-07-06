# Systems — Documentación por Subsistema Técnico

## Propósito

Vista técnica del conocimiento, organizada por componente de la máquina.
Usada para diagnósticos avanzados cuando se conoce qué subsistema falla.

## Subsistemas cubiertos

### `refrigeracion/`
Compresor, evaporador, condensador, gas refrigerante (R134a, R290),
termostatos, válvulas, sensores NTC de temperatura.
- Includes: tablas de presión-temperatura por gas, torques, especificaciones

### `pago/`
Validadores de moneda (MEI, JCM), lectores de billete, sistemas cashless
(MDB, Executive protocol), datáfonos integrados, devolución de cambio.
- Includes: protocolos MDB/Executive, tablas de calibración

### `dispensador/`
Motores de espiral, sensores de producto, bandejas, elevadores,
mecanismos de caída, detectores de atasco.
- Includes: ajuste de motores, tiempos de giro, detección de caída

### `electricidad/`
Placas de control, transformadores, fusibles, cableado, conectores,
fuentes de alimentación, iluminación LED/fluorescente.
- Includes: esquemas eléctricos genéricos, valores de tensión esperados

### `software/`
Firmware, menús de configuración, precios, estadísticas de venta,
comunicaciones (GSM, Ethernet), actualizaciones.
- Includes: secuencias de acceso a menús técnicos por marca

## Relación con otros directorios

Un mismo problema cruza subsistemas. Ejemplo:
- "No dispensa" puede ser: dispensador (atasco) + electricidad (motor quemado) + software (config)
- El bot debe consultar todos los subsistemas relevantes para el síntoma

## Cuándo usar esta carpeta vs symptoms/

- `symptoms/` → entrada del usuario (no sabe técnica)
- `systems/` → cuando ya tenemos diagnóstico y necesitamos profundidad técnica
