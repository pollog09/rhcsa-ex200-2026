import type { Metadata } from "next";
import { cargarObjetivos, cargarPreguntas } from "@/lib/datos";
import { Encabezado } from "@/components/ui";
import ObjetivosCliente from "./ObjetivosCliente";

export const metadata: Metadata = { title: "Objetivos oficiales" };

export default function ObjetivosPage() {
  const titulos = Object.fromEntries(cargarPreguntas().map((p) => [p.id, { titulo: p.titulo, tipo: p.tipo, dominio: p.dominio }]));
  return (
    <>
      <Encabezado titulo="Objetivos oficiales del EX200">
        La lista oficial de Red Hat para el examen basado en RHEL 10, objetivo por objetivo, con el tema y los ejercicios que
        lo cubren. Marca cada uno cuando lo domines: es tu checklist antes del examen.
      </Encabezado>
      <p className="text-sm text-muted -mt-4 mb-8">
        Fuente:{" "}
        <a
          className="underline"
          href="https://www.redhat.com/en/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam"
          target="_blank"
          rel="noreferrer"
        >
          redhat.com · EX200
        </a>{" "}
        (revisado el 29/09/2026). Los objetivos se muestran en inglés, tal como los publica Red Hat.
      </p>
      <ObjetivosCliente objetivos={cargarObjetivos()} titulos={titulos} />
    </>
  );
}
