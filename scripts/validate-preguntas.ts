// Valida los datos del sitio: npm run validate
import { z } from "zod";
import { cargarComandos, cargarPreguntas, cargarTemas } from "../src/lib/datos";
import { DOMINIO_SLUGS } from "../src/lib/dominios";

const ESPERADAS = 111;
const errores: string[] = [];

let preguntas: ReturnType<typeof cargarPreguntas> = [];
try {
  preguntas = cargarPreguntas();
} catch (e) {
  if (e instanceof z.ZodError) errores.push(...e.issues.map((i) => `preguntas: ${i.path.join(".")} ${i.message}`));
  else throw e;
}

if (preguntas.length !== ESPERADAS) errores.push(`Hay ${preguntas.length} preguntas, se esperaban ${ESPERADAS}`);

const vistos = new Set<string>();
for (const p of preguntas) {
  if (vistos.has(p.id)) errores.push(`id duplicado: ${p.id}`);
  vistos.add(p.id);
}

for (const slug of DOMINIO_SLUGS) {
  const n = preguntas.filter((p) => p.dominio === slug);
  if (!n.some((p) => p.tipo === "tarea")) errores.push(`El dominio ${slug} no tiene tareas`);
  console.log(`${slug.padEnd(26)} ${String(n.length).padStart(3)}  (tareas ${n.filter((p) => p.tipo === "tarea").length})`);
}

const temas = cargarTemas();
for (const slug of DOMINIO_SLUGS) if (!temas.some((t) => t.slug === slug)) errores.push(`Falta el tema ${slug}`);
const comandos = cargarComandos();
console.log(`\nPreguntas: ${preguntas.length} · Temas: ${temas.length} · Comandos: ${comandos.length}`);

if (errores.length) {
  console.error("\nErrores:\n- " + errores.join("\n- "));
  process.exit(1);
}
console.log("OK");
