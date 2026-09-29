"use client";

import { useState } from "react";
import type { Comando, Pregunta } from "@/lib/esquema";
import { DOMINIOS, tituloDominio } from "@/lib/dominios";
import { mezclar } from "@/lib/azar";
import { registrarQuiz } from "@/lib/progreso";
import QuizQuestion, { type ItemQuiz } from "@/components/QuizQuestion";
import { Tarjeta, boton, botonPrimario } from "@/components/ui";

type Modo = "conceptos" | "comandos";

// Convierte el cheat sheet en preguntas "¿qué comando hace X?"
function preguntasDeComandos(comandos: Comando[], dominio: string): ItemQuiz[] {
  const pool = comandos.filter((c) => !dominio || c.dominio === dominio);
  const nombres = (lista: Comando[]) => [...new Set(lista.map((c) => c.comando))];
  return mezclar(pool).flatMap((c, i) => {
    const mismos = nombres(comandos.filter((x) => x.dominio === c.dominio && x.comando !== c.comando));
    const otros = nombres(comandos.filter((x) => x.comando !== c.comando));
    const distractores = mezclar(mismos.length >= 3 ? mismos : otros).slice(0, 3);
    if (distractores.length < 3) return [];
    const opciones = mezclar([c.comando, ...distractores]);
    return [
      {
        id: `cmd-${i}`,
        etiqueta: tituloDominio(c.dominio),
        enunciado: `¿Qué comando usas para esto?\n\n> ${c.descripcion}`,
        opciones: opciones.map((o) => "`" + o + "`"),
        correcta: opciones.indexOf(c.comando),
        explicacion: "Ejemplo:\n\n```bash\n" + c.ejemplo + "\n```",
      },
    ];
  });
}

export default function QuizCliente({ preguntas, comandos }: { preguntas: Pregunta[]; comandos: Comando[] }) {
  const [modo, setModo] = useState<Modo>("conceptos");
  const [dominio, setDominio] = useState("");
  const [cantidad, setCantidad] = useState(10);
  const [ronda, setRonda] = useState<{ items: ItemQuiz[]; ids: string[] } | null>(null);
  const [respuestas, setRespuestas] = useState<boolean[]>([]);
  const [clave, setClave] = useState(0);

  function empezar() {
    let items: ItemQuiz[];
    let ids: string[] = [];
    if (modo === "conceptos") {
      const sel = mezclar(preguntas.filter((p) => !dominio || p.dominio === dominio)).slice(0, cantidad);
      ids = sel.map((p) => p.id);
      items = sel.map((p) => ({
        id: p.id,
        etiqueta: tituloDominio(p.dominio),
        enunciado: p.enunciado,
        opciones: p.opciones ?? [],
        correcta: p.correcta ?? 0,
        explicacion: p.explicacion,
      }));
    } else {
      items = preguntasDeComandos(comandos, dominio).slice(0, cantidad);
    }
    setRonda({ items, ids });
    setRespuestas([]);
    setClave((k) => k + 1);
  }

  const aciertos = respuestas.filter(Boolean).length;
  const terminado = ronda && respuestas.length === ronda.items.length && ronda.items.length > 0;

  return (
    <>
      <Tarjeta className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4" role="tablist">
          {(["conceptos", "comandos"] as Modo[]).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={modo === m}
              onClick={() => setModo(m)}
              className={`${boton} ${modo === m ? "!border-accent !text-accent" : ""}`}
            >
              {m === "conceptos" ? `Conceptos (${preguntas.length})` : `Comandos (${comandos.length})`}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-[1fr_auto_auto] gap-3 items-end">
          <label className="text-sm">
            <span className="text-muted">Tema</span>
            <select className="bg-panel border border-line rounded-lg px-3 py-2 w-full" value={dominio} onChange={(e) => setDominio(e.target.value)}>
              <option value="">Todos los temas</option>
              {DOMINIOS.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.titulo}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-muted">Preguntas</span>
            <select className="bg-panel border border-line rounded-lg px-3 py-2 w-full" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))}>
              {[5, 10, 20, 40].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button className={botonPrimario} onClick={empezar}>
            {ronda ? "Nuevo quiz" : "Empezar"}
          </button>
        </div>
      </Tarjeta>

      {ronda && (
        <>
          <div className="sticky top-14 z-10 bg-bg/95 backdrop-blur py-2 mb-4 text-sm flex justify-between border-b border-line">
            <span>
              Respondidas {respuestas.length} / {ronda.items.length}
            </span>
            <span className="font-semibold">Aciertos: {aciertos}</span>
          </div>
          {ronda.items.length === 0 && <p className="text-muted">No hay preguntas para ese tema todavía.</p>}
          <div className="grid gap-4" key={clave}>
            {ronda.items.map((it, i) => (
              <QuizQuestion
                key={it.id}
                item={it}
                numero={i + 1}
                onResponder={(ok) => {
                  setRespuestas((r) => [...r, ok]);
                  if (modo === "conceptos") registrarQuiz(it.id, ok);
                }}
              />
            ))}
          </div>
          {terminado && (
            <Tarjeta className="mt-6 text-center">
              <p className="text-2xl font-bold">
                {aciertos} / {ronda.items.length}
              </p>
              <p className="text-muted mt-1">
                {aciertos / ronda.items.length >= 0.7
                  ? "¡Buen trabajo! Sigue así con las tareas prácticas."
                  : "Repasa el resumen del tema y vuelve a intentarlo."}
              </p>
              <button className={`${botonPrimario} mt-4`} onClick={empezar}>
                Otro quiz
              </button>
            </Tarjeta>
          )}
        </>
      )}
    </>
  );
}
