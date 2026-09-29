import type { Metadata } from "next";
import { cargarPagina } from "@/lib/datos";
import Markdown from "@/components/Markdown";
import { Encabezado } from "@/components/ui";

export const metadata: Metadata = { title: "Arma tu laboratorio" };

export default function Page() {
  return (
    <>
      <Encabezado titulo="Arma tu laboratorio">Lo que necesitas para practicar en casa como en el examen real.</Encabezado>
      <Markdown>{cargarPagina("laboratorio")}</Markdown>
    </>
  );
}
