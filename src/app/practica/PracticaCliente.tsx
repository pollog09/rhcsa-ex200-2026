"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Pregunta } from "@/lib/esquema";
import { DOMINIOS } from "@/lib/dominios";
import { useProgreso } from "@/lib/progreso";
import TaskCard from "@/components/TaskCard";
import { Barra } from "@/components/ui";

const selectCls = "bg-panel border border-line rounded-lg px-3 py-2 text-sm w-full";

export default function PracticaCliente({ tareas }: { tareas: Pregunta[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const ruta = usePathname();
  const progreso = useProgreso();

  const dominio = params.get("dominio") ?? "";
  const dificultad = params.get("dificultad") ?? "";
  const estado = params.get("estado") ?? "";

  // Los filtros viven en la URL para poder compartir el enlace
  function cambiar(clave: string, valor: string) {
    const nuevos = new URLSearchParams(params.toString());
    if (valor) nuevos.set(clave, valor);
    else nuevos.delete(clave);
    router.replace(`${ruta}?${nuevos.toString()}`, { scroll: false });
  }

  const filtradas = useMemo(
    () =>
      tareas.filter(
        (t) =>
          (!dominio || t.dominio === dominio) &&
          (!dificultad || t.dificultad === dificultad) &&
          (!estado || (estado === "hechas" ? progreso.tareas[t.id] : !progreso.tareas[t.id])),
      ),
    [tareas, dominio, dificultad, estado, progreso.tareas],
  );

  // La lista se pinta en el cliente: al llegar con #id (desde Objetivos), baja hasta esa tarea
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const base = tareas.filter((t) => !dominio || t.dominio === dominio);
  const hechas = base.filter((t) => progreso.tareas[t.id]).length;

  return (
    <>
      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <label className="text-sm">
          <span className="text-muted">Tema</span>
          <select className={selectCls} value={dominio} onChange={(e) => cambiar("dominio", e.target.value)}>
            <option value="">Todos</option>
            {DOMINIOS.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.titulo}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="text-muted">Dificultad</span>
          <select className={selectCls} value={dificultad} onChange={(e) => cambiar("dificultad", e.target.value)}>
            <option value="">Todas</option>
            <option value="facil">Fácil</option>
            <option value="media">Media</option>
            <option value="dificil">Difícil</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="text-muted">Estado</span>
          <select className={selectCls} value={estado} onChange={(e) => cambiar("estado", e.target.value)}>
            <option value="">Todas</option>
            <option value="pendientes">Pendientes</option>
            <option value="hechas">Hechas</option>
          </select>
        </label>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted mb-1">
          <span>
            {hechas} de {base.length} hechas
          </span>
          <span>Mostrando {filtradas.length}</span>
        </div>
        <Barra valor={hechas} total={base.length} />
      </div>

      <div className="grid gap-4">
        {filtradas.map((t) => (
          <TaskCard key={t.id} p={t} />
        ))}
        {filtradas.length === 0 && <p className="text-muted">No hay tareas con esos filtros.</p>}
      </div>
    </>
  );
}
