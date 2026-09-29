# RHCSA EX200 · Guía de estudio interactiva (RHEL 10 · 2026)

Sitio web en **Next.js** para preparar el examen **Red Hat Certified System Administrator (EX200)**, basado en RHEL 10. Está pensado para estudiantes principiantes: explica cada tema de forma simple y se aprende practicando.

Complementa el curso [Distriib/curso-linux](https://github.com/Distriib/curso-linux) (40 h, RH124 + RH134).

## Qué incluye

| Sección | Contenido |
|---|---|
| **Objetivos** (`/objetivos`) | Checklist de los 62 objetivos oficiales de Red Hat, cada uno con su explicación y sus ejercicios |
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
- [`docs/COBERTURA-EX200.md`](docs/COBERTURA-EX200.md): matriz objetivo oficial → tema → ejercicios.
- [`docs/AUDITORIA-2026-09.md`](docs/AUDITORIA-2026-09.md): validación contra el temario oficial de RHEL 10 y cambios aplicados.

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

> Si usas el antiguo `docker-compose` (v1) y al reconstruir aparece `KeyError: 'ContainerConfig'`, ejecuta primero `docker-compose down` y luego `docker-compose up -d --build`.

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

## Opción 3: Windows con WSL y Red Hat Enterprise Linux

Sí, el sitio funciona dentro de **RHEL en WSL2**. Se probó con RHEL 9.8 y podman 5.8 en modo rootless, y es igual en RHEL 10. En RHEL no se usa Docker, sino **Podman**: acepta los mismos comandos y el mismo `Dockerfile`.

### 1. Instala RHEL en WSL (una sola vez)

1. Descarga la imagen **Red Hat Enterprise Linux for WSL** desde [developers.redhat.com](https://developers.redhat.com/products/rhel/download). Necesitas la suscripción gratuita de desarrollador.
2. En PowerShell, instálala con `wsl --install --from-file <archivo descargado>` o con `wsl --import`, según el formato del archivo.
3. Entra a la distro con `wsl -d <nombre>`. Para ver el nombre, ejecuta `wsl -l -v`.
4. Registra el sistema para poder usar `dnf`:

```bash
sudo subscription-manager register        # usuario y contraseña de developers.redhat.com
```

### 2. Construye y levanta el sitio con Podman

```bash
sudo dnf install -y podman git

git clone https://github.com/pollog09/rhcsa-ex200-2026.git
cd rhcsa-ex200-2026

podman build -t rhcsa-ex200-2026 .
podman run -d --name rhcsa-ex200 --network host rhcsa-ex200-2026
```

Luego abre **http://localhost:3000** en el navegador de Windows.

> **¿Por qué `--network host`?** Con Podman sin root (*rootless*) y la opción habitual `-p 3000:3000`, el sitio responde dentro de WSL, pero **Windows no lo ve en `localhost`**. Hay dos soluciones:
> - Usar `--network host`, como en el comando de arriba (recomendado).
> - Usar `-p 3000:3000` y abrir en Windows `http://<IP de WSL>:3000`. La IP se obtiene con `hostname -I | cut -d' ' -f1`.
>
> Si el puerto 3000 está ocupado, por ejemplo por otra distro de WSL (todas comparten la red), cámbialo con `-e PORT=3002`.

Comandos útiles:

```bash
podman ps                                  # ver si está corriendo
podman logs -f rhcsa-ex200                 # ver los logs
podman stop rhcsa-ex200                    # detener
podman start rhcsa-ex200                   # volver a arrancar
podman rm -f rhcsa-ex200                   # borrar el contenedor

# Actualizar a la última versión del repo
git pull && podman build -t rhcsa-ex200-2026 . \
  && podman rm -f rhcsa-ex200 \
  && podman run -d --name rhcsa-ex200 --network host rhcsa-ex200-2026
```

Si aparece el aviso `Using cgroups-v1 which is deprecated`, es solo informativo: el contenedor funciona igual. Para ocultarlo, ejecuta `export PODMAN_IGNORE_CGROUPSV1_WARNING=1`.

### Problemas frecuentes con Podman

| Síntoma | Solución |
|---|---|
| `npm error ... esbuild ... ETXTBSY` durante el build | Tienes una copia vieja del repo. Actualízala con `git pull` y vuelve a construir con `podman build --no-cache -t rhcsa-ex200-2026 .` |
| `EADDRINUSE: address already in use 0.0.0.0:3000` | Otro proceso usa el puerto 3000, por ejemplo Docker en otra distro de WSL. Detenlo o usa `-e PORT=3002` |
| El sitio abre dentro de WSL pero no en Windows | Arranca el contenedor con `--network host`, como se indica arriba |
| Usas `podman-compose up -d --build` | Funciona, pero publica el puerto con `-p` y, en modo rootless, Windows no lo ve en `localhost`. Ábrelo con la IP de WSL (`hostname -I`) o usa el `podman run --network host` de arriba |

### Alternativa: Docker Desktop

Si ya tienes **Docker Desktop** en Windows, ve a *Settings → Resources → WSL integration*, activa la distro de RHEL y usa los comandos de la [Opción 1](#opción-1-docker-recomendado) (`docker compose up -d --build`).

### Alternativa: nativo en RHEL (sin contenedor)

El `nodejs` que RHEL instala por defecto es muy viejo (v16 en RHEL 9). Activa primero el módulo de Node.js 24:

```bash
sudo dnf module install -y nodejs:24/common
node -v                                    # debe mostrar v24.x
```

Después sigue los pasos de la [Opción 2](#opción-2-nativo-sin-docker).

> **Ojo:** RHEL en WSL sirve para **ver el sitio**, no para **practicar el examen**. WSL no tiene GRUB, discos virtuales ni un arranque real, así que no puedes practicar particiones, LVM, swap, targets ni el reseteo de root. Para eso usa una máquina virtual (mira `/laboratorio` en el sitio).

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
- **Objetivos oficiales:** están en `data/objetivos.json`. Si Red Hat cambia el temario, actualízalo y ejecuta `npm run cobertura:md`. `npm run validate` falla si algún objetivo se queda sin ejercicio.

```bash
npm run validate      # valida todas las preguntas (también se ejecuta antes de cada build)
npm run lint
```

## Sobre las preguntas

Todos los ejercicios son **originales**. Cubren los [objetivos oficiales del EX200](https://www.redhat.com/es/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam) y los tipos de tarea más comunes. **No** contienen preguntas copiadas de bancos de "dumps", como ExamTopics. Ese material infringe el acuerdo de confidencialidad de Red Hat, que puede revocar la certificación a quien lo use.

> Proyecto educativo independiente, sin afiliación con Red Hat, Inc. Red Hat, RHEL y RHCSA son marcas de Red Hat, Inc.
