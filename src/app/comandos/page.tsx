import type { Metadata } from "next";
import { cargarComandos } from "@/lib/datos";
import { Encabezado } from "@/components/ui";
import ComandosCliente from "./ComandosCliente";

export const metadata: Metadata = { title: "Comandos" };

export default function ComandosPage() {
  return (
    <>
      <Encabezado titulo="Chuleta de comandos">
        Todos los comandos del examen en un solo lugar. Busca por nombre o por lo que quieres hacer, por ejemplo
        &ldquo;contraseña&rdquo;, &ldquo;montar&rdquo; o &ldquo;puerto&rdquo;.
      </Encabezado>
      <ComandosCliente comandos={cargarComandos()} />
    </>
  );
}
