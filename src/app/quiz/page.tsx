import type { Metadata } from "next";
import { cargarComandos, cargarPreguntas } from "@/lib/datos";
import { Encabezado } from "@/components/ui";
import QuizCliente from "./QuizCliente";

export const metadata: Metadata = { title: "Quiz" };

export default function QuizPage() {
  const opciones = cargarPreguntas().filter((p) => p.tipo === "opcion");
  const comandos = cargarComandos();
  return (
    <>
      <Encabezado titulo="Quiz interactivo">
        Repasa conceptos con preguntas de opción múltiple o entrena tu memoria de comandos. Cada respuesta se corrige al
        instante y te explica el porqué.
      </Encabezado>
      <QuizCliente preguntas={opciones} comandos={comandos} />
    </>
  );
}
