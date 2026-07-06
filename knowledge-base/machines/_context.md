# Machines — Documentación por Marca y Modelo

## Propósito

Cada subcarpeta contiene los manuales y documentación técnica de una marca.
Esta es la KB principal que se consulta cuando el usuario identifica su máquina.

## Estructura dentro de cada marca

```
necta/
├── _context.md          — modelos cubiertos, peculiaridades de la marca
├── colibri/
│   ├── manual-usuario.md
│   ├── manual-tecnico.md
│   └── esquema-electrico.md
├── venezia/
└── snakky/
```

## Marcas cubiertas en V1

| Marca | Cuota mercado ES | Prioridad | Modelos objetivo |
|-------|-----------------|-----------|-----------------|
| Necta | Alta | 1 | Colibri, Venezia, Snakky, Break |
| Crane | Alta | 1 | 968, Evolution, BevMax |
| FAS | Media | 2 | Spring, Eco, Vending |
| Jofemar | Media | 2 | Vision ES, iCherry |
| Wurlitzer | Baja | 3 | diversos |
| Sielaff | Baja | 3 | diversos |

## Cómo añadir una marca nueva

1. Crear carpeta `knowledge-base/machines/[marca]/`
2. Crear `_context.md` con: modelos, protocolos de comunicación, peculiaridades
3. Añadir los PDFs y ejecutar `scripts/ingest-manuals.ts`
4. Actualizar la tabla de marcas en este archivo

## Tip para el bot

Cuando el usuario no sabe el modelo exacto, pedirle foto de la placa de características
(normalmente en el lateral o interior de la máquina). La placa tiene marca, modelo y número de serie.
