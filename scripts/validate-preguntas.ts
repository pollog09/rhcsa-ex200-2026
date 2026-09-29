// Valida los datos del sitio: npm run validate
import { z } from "zod";
import { cargarComandos, cargarObjetivos, cargarPreguntas, cargarTemas } from "../src/lib/datos";
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

// Cada objetivo oficial del EX200 debe estar cubierto por al menos un ejercicio existente
const OBJETIVOS_OFICIALES = 62;
const objetivos = cargarObjetivos();
if (objetivos.length !== OBJETIVOS_OFICIALES) errores.push(`Hay ${objetivos.length} objetivos, se esperaban ${OBJETIVOS_OFICIALES}`);
for (const o of objetivos) {
  if (!o.ejercicios.length) errores.push(`Objetivo sin ejercicios: ${o.oficial}`);
  for (const id of o.ejercicios) {
    const p = preguntas.find((x) => x.id === id);
    if (!p) errores.push(`Objetivo "${o.oficial}" referencia un ejercicio inexistente: ${id}`);
    else if (p.dominio !== o.dominio) console.warn(`Aviso: ${id} (${p.dominio}) cubre un objetivo de ${o.dominio}`);
  }
}
console.log(`Objetivos oficiales: ${objetivos.length}`);
console.log(`\nPreguntas: ${preguntas.length} · Temas: ${temas.length} · Comandos: ${comandos.length}`);

if (errores.length) {
  console.error("\nErrores:\n- " + errores.join("\n- "));
  process.exit(1);
}
console.log("OK");
