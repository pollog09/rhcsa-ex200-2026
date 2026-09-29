"use client";

import type { Pregunta } from "@/lib/esquema";
import { tituloDominio } from "@/lib/dominios";
import { registrarQuiz } from "@/lib/progreso";
import QuizQuestion from "./QuizQuestion";

// Lista de preguntas de opción múltiple que registra aciertos en el progreso
export default function QuizLista({ preguntas, mostrarDominio = false }: { preguntas: Pregunta[]; mostrarDominio?: boolean }) {
  return (
    <div className="grid gap-4">
      {preguntas.map((p, i) => (
        <QuizQuestion
          key={p.id}
          numero={i + 1}
          item={{
            id: p.id,
            etiqueta: mostrarDominio ? tituloDominio(p.dominio) : undefined,
            enunciado: p.enunciado,
            opciones: p.opciones ?? [],
            correcta: p.correcta ?? 0,
            explicacion: p.explicacion,
          }}
          onResponder={(ok) => registrarQuiz(p.id, ok)}
        />
      ))}
    </div>
  );
}
