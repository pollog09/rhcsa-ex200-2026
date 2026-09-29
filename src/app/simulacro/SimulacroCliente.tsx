"use client";

import { useEffect, useState } from "react";
import type { Pregunta } from "@/lib/esquema";
import { DOMINIOS } from "@/lib/dominios";
import { mezclar } from "@/lib/azar";
import { guardarLocal, leerLocal, registrarSimulacro } from "@/lib/progreso";
import TaskCard from "@/components/TaskCard";
import Markdown from "@/components/Markdown";
import { Tarjeta, boton, botonPrimario } from "@/components/ui";

const CLAVE = "ex200-simulacro-v1";
const DURACION = 3 * 60 * 60 * 1000;
const TOTAL_TAREAS = 15;
const PUNTOS = 300;
const APROBAR = 210;

type Estado = {
  fase: "en-curso" | "revision" | "resultado";
  ids: string[];
  inicio: number;
  fin?: number;
  correctas: Record<string, boolean>;
  puntaje?: number;
};

// Una tarea de cada tema y el resto al azar, para que el simulacro cubra todo
function elegirTareas(tareas: Pregunta[]): string[] {
  const elegidas = new Set<string>();
  for (const d of DOMINIOS) {
    const delTema = mezclar(tareas.filter((t) => t.dominio === d.slug));
    if (delTema[0]) elegidas.add(delTema[0].id);
  }
  for (const t of mezclar(tareas)) {
    if (elegidas.size >= TOTAL_TAREAS) break;
    elegidas.add(t.id);
  }
  return mezclar([...elegidas]);
}

function formatear(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}:${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export default function SimulacroCliente({ tareas }: { tareas: Pregunta[] }) {
  const [estado, setEstado] = useState<Estado | null>(null);
  const [cargado, setCargado] = useState(false);
  const [ahora, setAhora] = useState(0);

  // Recupera un simulacro en curso (sobrevive a recargar la página)
  useEffect(() => {
    setEstado(leerLocal<Estado>(CLAVE));
    setAhora(Date.now());
    setCargado(true);
  }, []);

  useEffect(() => {
    if (estado?.fase !== "en-curso") return;
    const t = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(t);
  }, [estado?.fase]);

  function actualizar(e: Estado | null) {
    setEstado(e);
    guardarLocal(CLAVE, e);
  }

  const restante = estado ? estado.inicio + DURACION - ahora : DURACION;

  useEffect(() => {
    if (estado?.fase === "en-curso" && restante <= 0) {
      actualizar({ ...estado, fase: "revision", fin: estado.inicio + DURACION });
    }
  }, [estado, restante]);

  if (!cargado) return null;

  const porId = new Map(tareas.map((t) => [t.id, t]));
  const lista = (estado?.ids ?? []).map((id) => porId.get(id)).filter((t): t is Pregunta => !!t);
  const valor = lista.length ? PUNTOS / lista.length : 0;

  if (!estado) {
    return (
      <Tarjeta>
        <h2 className="text-xl font-bold">Antes de empezar</h2>
        <ul className="list-disc pl-5 mt-3 space-y-1.5 text-sm">
          <li>Usa una VM de práctica con un snapshot limpio: vas a romper y arreglar cosas.</li>
          <li>Ten al menos un disco extra sin usar (para particiones, LVM y swap).</li>
          <li>No uses pistas ni internet. Solo `man`, `--help` y `/usr/share/doc`, como en el examen.</li>
          <li>Antes de terminar, <strong>reinicia la VM</strong> y comprueba que todo sigue funcionando.</li>
          <li>El reloj sigue corriendo aunque cierres la página.</li>
        </ul>
        <button
          className={`${botonPrimario} mt-5`}
          onClick={() => {
            const inicio = Date.now();
            setAhora(inicio);
            actualizar({ fase: "en-curso", ids: elegirTareas(tareas), inicio, correctas: {} });
          }}
        >
          Empezar simulacro (3 h)
        </button>
      </Tarjeta>
    );
  }

  if (estado.fase === "en-curso") {
    const poco = restante < 15 * 60 * 1000;
    return (
      <>
        <div className="sticky top-14 z-10 bg-bg/95 backdrop-blur py-3 mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-line">
          <span className={`font-mono text-2xl font-semibold ${poco ? "text-bad" : ""}`} aria-live="polite">
            {formatear(restante)}
          </span>
          <button className={botonPrimario} onClick={() => actualizar({ ...estado, fase: "revision", fin: Date.now() })}>
            Terminar y corregir
          </button>
        </div>
        <div className="grid gap-4">
          {lista.map((t, i) => (
            <TaskCard key={t.id} p={t} numero={i + 1} modoExamen />
          ))}
        </div>
      </>
    );
  }

  const puntaje = Math.round(lista.filter((t) => estado.correctas[t.id]).length * valor);
  const usado = formatear((estado.fin ?? ahora) - estado.inicio);

  if (estado.fase === "revision") {
    return (
      <>
        <Tarjeta className="mb-6">
          <h2 className="text-xl font-bold">Corrige tu simulacro</h2>
          <p className="text-sm text-muted mt-1">
            Tiempo usado: {usado}. Para cada tarea, ejecuta los comandos de verificación en tu VM (después de reiniciar) y marca
            solo las que pasan completas. Cada tarea vale {valor} puntos.
          </p>
        </Tarjeta>
        <div className="grid gap-4">
          {lista.map((t, i) => (
            <article key={t.id} className="bg-panel border border-line rounded-xl p-5">
              <div className="font-mono text-sm text-muted">#{i + 1}</div>
              <h3 className="text-lg font-semibold">{t.titulo}</h3>
              <Markdown className="text-sm mt-2">{t.enunciado}</Markdown>
              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-medium">Verificación y solución</summary>
                <Markdown className="mt-2">{"**Verificación**\n\n```bash\n" + t.verificacion.trim() + "\n```\n\n**Solución**\n\n```bash\n" + t.solucion.trim() + "\n```"}</Markdown>
              </details>
              <label className="mt-4 flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-[var(--ok)]"
                  checked={!!estado.correctas[t.id]}
                  onChange={(e) => actualizar({ ...estado, correctas: { ...estado.correctas, [t.id]: e.target.checked } })}
                />
                La completé y la verificación pasa
              </label>
            </article>
          ))}
        </div>
        <div className="mt-6 flex gap-2">
          <button
            className={botonPrimario}
            onClick={() => {
              registrarSimulacro(puntaje);
              actualizar({ ...estado, fase: "resultado", puntaje });
            }}
          >
            Ver resultado
          </button>
        </div>
      </>
    );
  }

  const final = estado.puntaje ?? puntaje;
  const aprobado = final >= APROBAR;
  const falladas = lista.filter((t) => !estado.correctas[t.id]);

  return (
    <>
      <Tarjeta className={`text-center ${aprobado ? "!border-ok" : "!border-bad"}`}>
        <p className="text-sm text-muted">Tu resultado</p>
        <p className="text-5xl font-bold mt-2">
          {final}
          <span className="text-2xl text-muted"> / {PUNTOS}</span>
        </p>
        <p className={`mt-2 text-lg font-semibold ${aprobado ? "text-ok" : "text-bad"}`}>
          {aprobado ? "Aprobado" : `No aprobado (necesitas ${APROBAR})`}
        </p>
        <p className="text-sm text-muted mt-1">Tiempo usado: {usado}</p>
        <button className={`${botonPrimario} mt-5`} onClick={() => actualizar(null)}>
          Nuevo simulacro
        </button>
      </Tarjeta>
      {falladas.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-3">Repasa estas tareas</h2>
          <ul className="grid gap-2">
            {falladas.map((t) => (
              <li key={t.id}>
                <a className={`${boton} w-full !justify-start`} href={`/temas/${t.dominio}`}>
                  {t.titulo}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
