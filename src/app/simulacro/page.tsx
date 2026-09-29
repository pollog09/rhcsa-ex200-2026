import type { Metadata } from "next";
import { cargarPreguntas } from "@/lib/datos";
import { Encabezado } from "@/components/ui";
import SimulacroCliente from "./SimulacroCliente";

export const metadata: Metadata = { title: "Simulacro de examen" };

export default function SimulacroPage() {
  const tareas = cargarPreguntas().filter((p) => p.tipo === "tarea");
  return (
    <>
      <Encabezado titulo="Simulacro de examen">
        15 tareas al azar de todos los temas, 3 horas de reloj y sin pistas, como el día real. Al terminar, revisas cada
        tarea con su solución y te pones nota. Para aprobar necesitas 210 de 300 puntos.
      </Encabezado>
      <SimulacroCliente tareas={tareas} />
    </>
  );
}
