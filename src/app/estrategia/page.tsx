import type { Metadata } from "next";
import { cargarPagina } from "@/lib/datos";
import Markdown from "@/components/Markdown";
import { Encabezado } from "@/components/ui";

export const metadata: Metadata = { title: "Estrategia para el día del examen" };

export default function Page() {
  return (
    <>
      <Encabezado titulo="Estrategia para el día del examen">Cómo organizar las 3 horas y no perder puntos por descuidos.</Encabezado>
      <Markdown>{cargarPagina("estrategia")}</Markdown>
    </>
  );
}
