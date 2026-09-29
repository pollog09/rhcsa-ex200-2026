"use client";

import Link from "next/link";
import { useState } from "react";
import { DOMINIOS } from "@/lib/dominios";
import { reiniciarProgreso, useProgreso } from "@/lib/progreso";
import { Barra, Tarjeta, boton } from "@/components/ui";

type Mini = { id: string; dominio: string; tipo: string };

export default function ProgresoCliente({ preguntas }: { preguntas: Mini[] }) {
  const p = useProgreso();
  const [confirmar, setConfirmar] = useState(false);

  const tareas = preguntas.filter((x) => x.tipo === "tarea");
  const hechas = tareas.filter((x) => p.tareas[x.id]).length;
  const respondidas = Object.keys(p.quiz).length;
  const aciertos = Object.values(p.quiz).filter(Boolean).length;
  const mejor = p.simulacros.reduce((m, s) => Math.max(m, s.puntaje), 0);

  return (
    <>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Tarjeta>
          <div className="text-sm text-muted">Tareas hechas</div>
          <div className="text-3xl font-bold mt-1">
            {hechas}
            <span className="text-lg text-muted"> / {tareas.length}</span>
          </div>
        </Tarjeta>
        <Tarjeta>
          <div className="text-sm text-muted">Aciertos en quiz</div>
          <div className="text-3xl font-bold mt-1">
            {respondidas ? Math.round((aciertos / respondidas) * 100) : 0}%
          </div>
          <div className="text-xs text-muted">{respondidas} preguntas respondidas</div>
        </Tarjeta>
        <Tarjeta>
          <div className="text-sm text-muted">Mejor simulacro</div>
          <div className={`text-3xl font-bold mt-1 ${mejor >= 210 ? "text-ok" : ""}`}>
            {p.simulacros.length ? mejor : "—"}
            <span className="text-lg text-muted"> / 300</span>
          </div>
        </Tarjeta>
      </div>

      <h2 className="text-xl font-bold mb-3">Por tema</h2>
      <div className="grid gap-3">
        {DOMINIOS.map((d) => {
          const deTema = tareas.filter((x) => x.dominio === d.slug);
          const ok = deTema.filter((x) => p.tareas[x.id]).length;
          return (
            <Link key={d.slug} href={`/practica?dominio=${d.slug}`} className="bg-panel border border-line rounded-xl p-4 hover:border-accent">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">{d.titulo}</span>
                <span className="text-muted">
                  {ok} / {deTema.length}
                </span>
              </div>
              <Barra valor={ok} total={deTema.length} />
            </Link>
          );
        })}
      </div>

      {p.simulacros.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-10 mb-3">Historial de simulacros</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-line">
              <thead className="bg-panel-2">
                <tr>
                  <th className="text-left p-2">Fecha</th>
                  <th className="text-left p-2">Puntaje</th>
                  <th className="text-left p-2">Resultado</th>
                </tr>
              </thead>
              <tbody>
                {p.simulacros.map((s) => (
                  <tr key={s.fecha} className="border-t border-line">
                    <td className="p-2">{new Date(s.fecha).toLocaleString("es")}</td>
                    <td className="p-2 font-mono">{s.puntaje}</td>
                    <td className={`p-2 ${s.aprobado ? "text-ok" : "text-bad"}`}>{s.aprobado ? "Aprobado" : "No aprobado"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="mt-10">
        {confirmar ? (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span>¿Borrar todo tu progreso?</span>
            <button
              className={`${boton} !text-bad !border-bad`}
              onClick={() => {
                reiniciarProgreso();
                setConfirmar(false);
              }}
            >
              Sí, borrar
            </button>
            <button className={boton} onClick={() => setConfirmar(false)}>
              Cancelar
            </button>
          </div>
        ) : (
          <button className={boton} onClick={() => setConfirmar(true)}>
            Reiniciar progreso
          </button>
        )}
      </div>
    </>
  );
}
