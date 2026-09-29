import type { Metadata } from "next";
import { cargarPreguntas } from "@/lib/datos";
import { Encabezado } from "@/components/ui";
import ProgresoCliente from "./ProgresoCliente";

export const metadata: Metadata = { title: "Mi progreso" };

export default function ProgresoPage() {
  const preguntas = cargarPreguntas().map(({ id, dominio, tipo }) => ({ id, dominio, tipo }));
  return (
    <>
      <Encabezado titulo="Mi progreso">
        Tu avance se guarda solo en este navegador. Si cambias de equipo o borras los datos del sitio, empieza de cero.
      </Encabezado>
      <ProgresoCliente preguntas={preguntas} />
    </>
  );
}
