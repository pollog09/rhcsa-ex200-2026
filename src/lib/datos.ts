import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { DOMINIO_SLUGS } from "./dominios";
import {
  ComandoSchema,
  ObjetivoSchema,
  PreguntaSchema,
  type Comando,
  type Objetivo,
  type Pregunta,
} from "./esquema";

// Solo se usa en el servidor (en build time): todas las páginas son estáticas.
const ROOT = process.cwd();

export function cargarPreguntas(): Pregunta[] {
  const dir = path.join(ROOT, "data", "preguntas");
  const todas: Pregunta[] = [];
  for (const slug of DOMINIO_SLUGS) {
    const archivo = path.join(dir, `${slug}.json`);
    if (!fs.existsSync(archivo)) continue;
    const crudo = JSON.parse(fs.readFileSync(archivo, "utf8"));
    todas.push(...z.array(PreguntaSchema).parse(crudo));
  }
  return todas;
}

export function cargarComandos(): Comando[] {
  const archivo = path.join(ROOT, "data", "comandos.json");
  if (!fs.existsSync(archivo)) return [];
  return z.array(ComandoSchema).parse(JSON.parse(fs.readFileSync(archivo, "utf8")));
}

export function cargarObjetivos(): Objetivo[] {
  const archivo = path.join(ROOT, "data", "objetivos.json");
  if (!fs.existsSync(archivo)) return [];
  return z.array(ObjetivoSchema).parse(JSON.parse(fs.readFileSync(archivo, "utf8")));
}

export type Tema = {
  slug: string;
  orden: number;
  titulo: string;
  resumen: string;
  dias: number[];
  contenido: string;
};

export function cargarTemas(): Tema[] {
  const dir = path.join(ROOT, "content", "temas");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
      return {
        slug: String(data.slug),
        orden: Number(data.orden),
        titulo: String(data.titulo),
        resumen: String(data.resumen ?? ""),
        dias: Array.isArray(data.dias) ? data.dias.map(Number) : [],
        contenido: content,
      };
    })
    .sort((a, b) => a.orden - b.orden);
}

export function cargarPagina(nombre: string): string {
  return fs.readFileSync(path.join(ROOT, "content", "paginas", `${nombre}.md`), "utf8");
}
