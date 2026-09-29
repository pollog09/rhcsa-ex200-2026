"use client";

import Link from "next/link";
import type { Objetivo } from "@/lib/esquema";
import { DOMINIOS } from "@/lib/dominios";
import { marcarObjetivo, useProgreso } from "@/lib/progreso";
import { Barra } from "@/components/ui";

export default function ObjetivosCliente({ objetivos, titulos }: { objetivos: Objetivo[]; titulos: Record<string, { titulo: string; tipo: string; dominio: string }> }) {
  const progreso = useProgreso();
  const dominados = objetivos.filter((o) => progreso.objetivos[o.id]).length;

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted mb-1">
          <span>
            {dominados} de {objetivos.length} objetivos dominados
          </span>
          <span>{Math.round((dominados / Math.max(1, objetivos.length)) * 100)}%</span>
        </div>
        <Barra valor={dominados} total={objetivos.length} />
      </div>

      {DOMINIOS.map((d) => {
        const lista = objetivos.filter((o) => o.dominio === d.slug);
        if (!lista.length) return null;
        return (
          <section key={d.slug} className="mb-8">
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <h2 className="text-xl font-bold">{d.titulo}</h2>
              <Link href={`/temas/${d.slug}`} className="text-sm text-accent underline shrink-0">
                Ver tema
              </Link>
            </div>
            <ul className="grid gap-2">
              {lista.map((o) => {
                const ok = !!progreso.objetivos[o.id];
                return (
                  <li key={o.id} className={`bg-panel border rounded-xl p-4 ${ok ? "border-ok" : "border-line"}`}>
                    <label className="flex gap-3 items-start cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1 w-4 h-4 shrink-0 accent-[var(--ok)]"
                        checked={ok}
                        onChange={(e) => marcarObjetivo(o.id, e.target.checked)}
                      />
                      <span>
                        <span className="font-medium block">{o.oficial}</span>
                        <span className="text-sm text-muted block">{o.explicacion}</span>
                      </span>
                    </label>
                    {o.ejercicios.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3 pl-7">
                        {o.ejercicios.map((id) => (
                          <Link
                            key={id}
                            href={titulos[id]?.tipo === "tarea" ? `/practica?dominio=${titulos[id].dominio}#${id}` : `/temas/${titulos[id]?.dominio ?? o.dominio}`}
                            className="text-xs px-2 py-0.5 rounded-full border border-line bg-panel-2 hover:border-accent"
                            title={titulos[id]?.tipo === "tarea" ? "Tarea práctica" : "Pregunta del mini quiz"}
                          >
                            {titulos[id]?.titulo ?? id}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </>
  );
}
