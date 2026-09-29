"use client";

import { useState } from "react";
import Markdown from "./Markdown";
import { Badge } from "./ui";

export type ItemQuiz = {
  id: string;
  etiqueta?: string;
  enunciado: string;
  opciones: string[];
  correcta: number;
  explicacion?: string;
};

// Pregunta de opción múltiple: se elige, se corrige al instante y se explica
export default function QuizQuestion({
  item,
  numero,
  onResponder,
}: {
  item: ItemQuiz;
  numero?: number;
  onResponder?: (acierto: boolean) => void;
}) {
  const [elegida, setElegida] = useState<number | null>(null);
  const respondida = elegida !== null;

  function elegir(i: number) {
    if (respondida) return;
    setElegida(i);
    onResponder?.(i === item.correcta);
  }

  return (
    <article className="bg-panel border border-line rounded-xl p-5">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {numero !== undefined && <span className="font-mono text-sm text-muted">#{numero}</span>}
        {item.etiqueta && <Badge>{item.etiqueta}</Badge>}
      </div>
      <Markdown className="font-medium">{item.enunciado}</Markdown>
      <div className="mt-4 grid gap-2" role="radiogroup">
        {item.opciones.map((op, i) => {
          let estilo = "border-line hover:bg-panel-2";
          if (respondida) {
            if (i === item.correcta) estilo = "border-ok bg-ok-soft";
            else if (i === elegida) estilo = "border-bad bg-bad-soft";
            else estilo = "border-line opacity-70";
          }
          return (
            <button
              key={i}
              role="radio"
              aria-checked={elegida === i}
              disabled={respondida}
              onClick={() => elegir(i)}
              className={`text-left border rounded-lg px-3 py-2 flex gap-3 items-start ${estilo}`}
            >
              <span className="font-mono text-sm text-muted mt-0.5">{String.fromCharCode(65 + i)}</span>
              <Markdown className="[&_p]:m-0 flex-1 min-w-0">{op}</Markdown>
            </button>
          );
        })}
      </div>
      {respondida && (
        <div className={`mt-4 rounded-lg px-3 py-2 text-sm ${elegida === item.correcta ? "bg-ok-soft" : "bg-bad-soft"}`}>
          <strong>{elegida === item.correcta ? "¡Correcto!" : `Incorrecto. La respuesta es ${String.fromCharCode(65 + item.correcta)}.`}</strong>
          {item.explicacion && <Markdown className="mt-1">{item.explicacion}</Markdown>}
        </div>
      )}
    </article>
  );
}
