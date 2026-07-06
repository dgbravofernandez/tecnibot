# Error Codes — Base de Datos de Códigos de Error

## Propósito

Lookup directo: código de error → diagnóstico + solución.
Es el flujo más rápido para técnicos que ven un código en pantalla.

## Archivos por marca

- `necta.md` — Códigos Necta (E001–E999, Fxx, Axx)
- `crane.md` — Códigos Crane (CSC, MDB errors)
- `fas.md` — Códigos FAS
- `jofemar.md` — Códigos Jofemar
- `wurlitzer.md` — Códigos Wurlitzer
- `sielaff.md` — Códigos Sielaff

## Formato estándar de cada código

```markdown
## E042 — Temperatura evaporador fuera de rango

**Marca:** Necta  
**Modelos:** Colibri, Venezia, Snakky  
**Severidad:** Alta (máquina puede dejar de servir)  
**Síntoma visible:** Pantalla muestra E042, productos no fríos  

### Causas más frecuentes (orden de probabilidad)
1. Gas refrigerante bajo (70% casos)
2. Sensor NTC defectuoso (20% casos)  
3. Compresor no arranca correctamente (10% casos)

### Pasos de diagnóstico
1. Verificar temperatura real del evaporador con termómetro
2. Comprobar que el ventilador del evaporador gira
3. Revisar conexiones del sensor NTC (conector J3 en placa principal)
4. Si persiste → requiere carga de gas (técnico SAT)

### Resetear el error
Menú técnico → Diagnósticos → Reset errores → Confirmar

### Escalación requerida
Si después de reset vuelve en <2h → gas bajo confirmado → llamar SAT
```

## Cómo poblar esta base

1. Fuente primaria: manuales técnicos oficiales (sección "códigos de error")
2. Fuente secundaria: vendingconnection.com/forum (buscar por código)
3. Cada código = 1 chunk en pgvector con metadatos: brand, code, severity
4. El bot puede hacer lookup directo con: `SELECT * FROM kb WHERE code = 'E042' AND brand = 'necta'`
