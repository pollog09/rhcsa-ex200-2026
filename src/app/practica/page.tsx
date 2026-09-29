import { Suspense } from "react";
import type { Metadata } from "next";
import { cargarPreguntas } from "@/lib/datos";
import { Encabezado } from "@/components/ui";
import PracticaCliente from "./PracticaCliente";

export const metadata: Metadata = { title: "Práctica" };

export default function PracticaPage() {
  const tareas = cargarPreguntas().filter((p) => p.tipo === "tarea");
  return (
    <>
      <Encabezado titulo="Tareas prácticas">
        El EX200 es 100% práctico: te dan un sistema y una lista de tareas. Resuelve cada una en tu laboratorio, usa las
        pistas solo si te trabas, y verifica siempre antes de marcarla como hecha.
      </Encabezado>
      <Suspense>
        <PracticaCliente tareas={tareas} />
      </Suspense>
    </>
  );
}
