# RHCSA EX200 · Guía de estudio interactiva (RHEL 10 · 2026)

Sitio web en **Next.js** para preparar el examen **Red Hat Certified System Administrator (EX200)**, basado en RHEL 10. Está pensado para estudiantes principiantes: explica cada tema de forma simple y se aprende practicando.

Complementa el curso [Distriib/curso-linux](https://github.com/Distriib/curso-linux) (40 h, RH124 + RH134).

## Qué incluye

| Sección | Contenido |
|---|---|
| **Temas** (`/temas`) | Los 10 dominios oficiales del EX200. Cada uno trae "en palabras simples", comandos clave, cómo lo piden en el examen, errores típicos y un mini quiz |
| **Comandos** (`/comandos`) | Chuleta de 200+ comandos con ejemplos, buscador y botón de copiar |
| **Práctica** (`/practica`) | Tareas estilo examen con pistas progresivas, solución y verificación, filtrables por tema y dificultad |
| **Quiz** (`/quiz`) | Opción múltiple de conceptos y un quiz de comandos que se genera desde la chuleta |
| **Simulacro** (`/simulacro`) | 15 tareas al azar (al menos una por dominio), reloj de 3 h, autocorrección y nota sobre 300 (se aprueba con 210) |
| **Laboratorio** (`/laboratorio`) | Cómo montar tu laboratorio en casa con RHEL 10 gratis |
| **Estrategia** (`/estrategia`) | Cómo organizar el día del examen y errores que hacen suspender |
| **Progreso** (`/progreso`) | Avance por tema e historial de simulacros, guardado en tu navegador |

En total hay **111 ejercicios originales** en `data/preguntas/`: 78 tareas prácticas y 33 de opción múltiple.

También se incluyen dos archivos para leer sin el sitio:
- [`RESUMEN-EX200.md`](RESUMEN-EX200.md): resumen de una página.
- [`COMANDOS.md`](COMANDOS.md): todos los comandos en tablas.

---

## Opción 1: Docker (recomendado)

Solo necesitas Docker.

```bash
git clone https://github.com/pollog09/rhcsa-ex200-2026.git
cd rhcsa-ex200-2026

docker compose up -d --build      # o: docker-compose up -d --build
# Abre http://localhost:3000
```

Otros comandos útiles:

```bash
docker compose logs -f            # ver los logs
docker compose down               # detener y borrar el contenedor
docker compose up -d --build      # reconstruir después de cambiar el contenido
```

Sin Compose:

```bash
docker build -t rhcsa-ex200-2026 .
docker run -d --name rhcsa-ex200 -p 3000:3000 rhcsa-ex200-2026
```

## Opción 2: Nativo (sin Docker)

Necesitas **Node.js 20 o superior** (recomendado 24) y npm.

```bash
git clone https://github.com/pollog09/rhcsa-ex200-2026.git
cd rhcsa-ex200-2026
npm install

# Modo desarrollo (recarga automática)
npm run dev                       # http://localhost:3000

# Modo producción
npm run build
npm start                         # http://localhost:3000
```

Para usar otro puerto: `npm run dev -- -p 8080` o `PORT=8080 npm start`.

---

## Estructura

```
content/temas/          Resúmenes de los 10 dominios (Markdown con frontmatter)
content/paginas/        Textos de Laboratorio y Estrategia
data/preguntas/         111 ejercicios en JSON (esquema en data/preguntas/ESQUEMA.md)
data/comandos.json      Chuleta de comandos
src/app/                Páginas (Next.js App Router, todas estáticas)
src/components/         Componentes: tarjeta de tarea, quiz, bloque de código...
src/lib/                Carga y validación de datos, progreso (localStorage)
scripts/                Validación de preguntas y generación de COMANDOS.md
```

## Editar o agregar contenido

- **Un tema:** edita `content/temas/NN-<dominio>.md`.
- **Una pregunta:** agrégala al JSON de su dominio siguiendo [`ESQUEMA.md`](data/preguntas/ESQUEMA.md). Después, en `scripts/validate-preguntas.ts`, cambia `ESPERADAS` por el nuevo total.
- **Un comando:** agrégalo a `data/comandos.json` y ejecuta `npm run comandos:md` para regenerar `COMANDOS.md`.

```bash
npm run validate      # valida todas las preguntas (también se ejecuta antes de cada build)
npm run lint
```

## Sobre las preguntas

Todos los ejercicios son **originales**. Cubren los [objetivos oficiales del EX200](https://www.redhat.com/es/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam) y los tipos de tarea más comunes. **No** contienen preguntas copiadas de bancos de "dumps", como ExamTopics. Ese material infringe el acuerdo de confidencialidad de Red Hat, que puede revocar la certificación a quien lo use.

> Proyecto educativo independiente, sin afiliación con Red Hat, Inc. Red Hat, RHEL y RHCSA son marcas de Red Hat, Inc.
