"use client";

import { useState } from "react";
import type { Pregunta } from "@/lib/esquema";
import { tituloDominio } from "@/lib/dominios";
import { marcarTarea, useProgreso } from "@/lib/progreso";
import Markdown from "./Markdown";
import { Badge, BadgeDificultad, boton } from "./ui";

function Bash({ codigo }: { codigo: string }) {
  return <Markdown>{"```bash\n" + codigo.trim() + "\n```"}</Markdown>;
}

// Tarea práctica: pistas progresivas -> solución -> verificación -> marcar como hecha
export default function TaskCard({
  p,
  numero,
  modoExamen = false,
}: {
  p: Pregunta;
  numero?: number;
  modoExamen?: boolean;
}) {
  const progreso = useProgreso();
  const [pistas, setPistas] = useState(0);
  const [verSolucion, setVerSolucion] = useState(false);
  const [verVerificacion, setVerVerificacion] = useState(false);
  const hecha = !!progreso.tareas[p.id];

  return (
    <article id={p.id} className={`scroll-mt-20 bg-panel border rounded-xl p-5 ${hecha && !modoExamen ? "border-ok" : "border-line"}`}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {numero !== undefined && <span className="font-mono text-sm text-muted">#{numero}</span>}
        <Badge>{tituloDominio(p.dominio)}</Badge>
        <BadgeDificultad nivel={p.dificultad} />
        {hecha && !modoExamen && <span className="text-xs font-medium text-ok">Hecha</span>}
      </div>
      <h3 className="text-lg font-semibold mb-2">{p.titulo}</h3>
      <Markdown>{p.enunciado}</Markdown>

      {!modoExamen && (
        <>
          {pistas > 0 && (
            <ol className="mt-4 space-y-2">
              {p.pistas.slice(0, pistas).map((t, i) => (
                <li key={i} className="text-sm bg-warn-soft rounded-lg px-3 py-2">
                  <strong>Pista {i + 1}:</strong> <Markdown className="inline [&_p]:inline">{t}</Markdown>
                </li>
              ))}
            </ol>
          )}

          {verSolucion && (
            <div className="mt-4">
              <h4 className="font-semibold text-sm mb-2">Solución</h4>
              <Bash codigo={p.solucion} />
              <div className="mt-3 text-sm bg-panel-2 rounded-lg px-3 py-2">
                <Markdown>{p.explicacion}</Markdown>
              </div>
            </div>
          )}

          {verVerificacion && (
            <div className="mt-4">
              <h4 className="font-semibold text-sm mb-2">Cómo verificar</h4>
              <Bash codigo={p.verificacion} />
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {pistas < p.pistas.length && (
              <button className={boton} onClick={() => setPistas(pistas + 1)}>
                Ver pista {pistas + 1} de {p.pistas.length}
              </button>
            )}
            <button className={boton} onClick={() => setVerSolucion(!verSolucion)}>
              {verSolucion ? "Ocultar solución" : "Ver solución"}
            </button>
            <button className={boton} onClick={() => setVerVerificacion(!verVerificacion)}>
              {verVerificacion ? "Ocultar verificación" : "Cómo verificar"}
            </button>
            <button
              className={`${boton} ${hecha ? "!bg-ok-soft !text-ok !border-ok" : ""}`}
              onClick={() => marcarTarea(p.id, !hecha)}
              aria-pressed={hecha}
            >
              {hecha ? "✓ Hecha" : "Marcar como hecha"}
            </button>
          </div>
        </>
      )}
    </article>
  );
}
