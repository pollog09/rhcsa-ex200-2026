import { z } from "zod";
import { DOMINIO_SLUGS } from "./dominios";

export const PreguntaSchema = z
  .object({
    id: z.string().regex(/^[a-z]+-\d{2}$/),
    dominio: z.enum(DOMINIO_SLUGS as [string, ...string[]]),
    tipo: z.enum(["tarea", "opcion"]),
    dificultad: z.enum(["facil", "media", "dificil"]),
    titulo: z.string().min(3),
    enunciado: z.string().min(10),
    pistas: z.array(z.string()),
    solucion: z.string(),
    verificacion: z.string(),
    explicacion: z.string().min(5),
    opciones: z.array(z.string()).length(4).optional(),
    correcta: z.number().int().min(0).max(3).optional(),
  })
  .refine((p) => p.tipo !== "opcion" || (p.opciones && p.correcta !== undefined), {
    message: "Las preguntas de opción múltiple necesitan 'opciones' y 'correcta'",
  })
  .refine((p) => p.tipo !== "tarea" || (p.solucion.length > 0 && p.verificacion.length > 0), {
    message: "Las tareas necesitan 'solucion' y 'verificacion'",
  });

export type Pregunta = z.infer<typeof PreguntaSchema>;

export const ComandoSchema = z.object({
  dominio: z.enum(DOMINIO_SLUGS as [string, ...string[]]),
  comando: z.string(),
  descripcion: z.string(),
  ejemplo: z.string(),
});

export type Comando = z.infer<typeof ComandoSchema>;
