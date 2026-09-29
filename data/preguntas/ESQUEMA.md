# Esquema de preguntas

Cada archivo `data/preguntas/<dominio>.json` es un ARRAY JSON de objetos:

```jsonc
{
  "id": "herr-01",                 // prefijo del dominio + número de 2 dígitos, único
  "dominio": "herramientas-esenciales",
  "tipo": "tarea",                 // "tarea" (práctica, estilo examen real) | "opcion" (opción múltiple)
  "dificultad": "facil",           // "facil" | "media" | "dificil"
  "titulo": "Buscar archivos de un usuario",   // corto, <= 60 caracteres
  "enunciado": "Markdown. Tarea concreta con nombres/valores exactos, como en el examen.",
  "pistas": ["pista 1", "pista 2"],            // 1-3 pistas progresivas, sin dar la solución completa
  "solucion": "comandos bash (un bloque, con comentarios # en español)",
  "verificacion": "comandos bash para comprobar que quedó bien (y persistente tras reboot si aplica)",
  "explicacion": "Por qué funciona / error típico. 1-4 frases, simple.",
  // solo si tipo == "opcion":
  "opciones": ["A", "B", "C", "D"],           // exactamente 4
  "correcta": 2                                // índice 0-3
}
```

Para `tipo: "opcion"`: `solucion` y `verificacion` pueden ser "" (cadena vacía); `pistas` puede ser [].
