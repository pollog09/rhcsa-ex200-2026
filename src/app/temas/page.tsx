import Link from "next/link";
import type { Metadata } from "next";
import { cargarPreguntas, cargarTemas } from "@/lib/datos";
import { Encabezado } from "@/components/ui";

export const metadata: Metadata = { title: "Temas" };

export default function TemasPage() {
  const temas = cargarTemas();
  const preguntas = cargarPreguntas();

  return (
    <>
      <Encabezado titulo="Temas del examen">
        Estos son los 10 dominios oficiales del EX200 en RHEL 10. Cada uno trae un resumen en palabras simples, los comandos
        clave, cómo aparece en el examen y los errores típicos.
      </Encabezado>
      <div className="grid sm:grid-cols-2 gap-4">
        {temas.map((t) => {
          const n = preguntas.filter((p) => p.dominio === t.slug).length;
          return (
            <Link
              key={t.slug}
              href={`/temas/${t.slug}`}
              className="bg-panel border border-line rounded-xl p-5 hover:border-accent transition-colors"
            >
              <div className="font-mono text-sm text-accent">{String(t.orden).padStart(2, "0")}</div>
              <h2 className="text-lg font-semibold mt-1">{t.titulo}</h2>
              <p className="text-muted text-sm mt-1">{t.resumen}</p>
              <p className="text-xs text-muted mt-3">{n} ejercicios de práctica</p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
