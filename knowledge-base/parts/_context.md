# Parts — Catálogo de Piezas y Repuestos

## Propósito

Identificar, describir y localizar piezas de repuesto para máquinas expendedoras.
El bot usa esta KB para recomendar piezas específicas tras un diagnóstico.

## Estructura de cada pieza

```markdown
## Compresor Embraco NEK2134GK

**Categoría:** refrigeracion/compresor  
**Compatible con:** Necta Colibri, Venezia 5  
**SKU fabricante:** NEK2134GK  
**SKU alternativo:** 099485 (Necta), NE2134GK (genérico)  
**Gas compatible:** R134a  
**Potencia:** 1/5 HP  
**Precio referencia:** €85-120 (2024)  

### Dónde comprar (ES/EU)
- vendingspares.co.uk — stock habitual
- repuestosexpendedoras.es — envío 24h España
- alibaba.com — lotes, plazo 15-30 días

### Cómo identificar si es este el que necesitas
La placa del compresor está en el lateral. Buscar "Embraco" + modelo.
Si la placa es ilegible, medir: voltaje (230V/50Hz), amperaje arranque (~3.2A)

### Herramientas necesarias para el cambio
Llave Allen 4mm, manómetros de gas (requiere SAT certificado para gas)
```

## Subcarpetas

- `compresor/` — compresores por marca/gas/potencia
- `motor-espiral/` — motores de espiral por tipo (paso a paso, DC, AC)
- `placa-control/` — placas madre y módulos de control
- `sensores/` — NTC temperatura, sensores de producto, fin de carrera

## Proveedores principales (España)

| Proveedor | URL | Especialidad |
|-----------|-----|--------------|
| Repuestos Expendedoras | repuestosexpendedoras.es | Genérico rápido |
| Vending Parts EU | vendingparts.eu | Marcas premium |
| Crane Parts | cranevendingparts.com | Solo Crane |
| Necta Parts | (distribuidor oficial) | Solo Necta |

## Nota sobre compatibilidad

Siempre verificar: voltaje (230V EU / 115V US), fase (monofásico/trifásico),
protocolo de comunicación (MDB vs Executive) antes de recomendar una pieza.
