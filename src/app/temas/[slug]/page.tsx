import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cargarPreguntas, cargarTemas } from "@/lib/datos";
import Markdown from "@/components/Markdown";
import QuizLista from "@/components/QuizLista";
import { BotonLink } from "@/components/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return cargarTemas().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = cargarTemas().find((x) => x.slug === slug);
  return { title: t?.titulo ?? "Tema", description: t?.resumen };
}

const REPO = "https://github.com/Distriib/curso-linux/tree/main/temario";

export default async function TemaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const temas = cargarTemas();
  const i = temas.findIndex((t) => t.slug === slug);
  if (i < 0) notFound();
  const tema = temas[i];
  const preguntas = cargarPreguntas().filter((p) => p.dominio === slug);
  const tareas = preguntas.filter((p) => p.tipo === "tarea").length;
  const opciones = preguntas.filter((p) => p.tipo === "opcion");
  const anterior = temas[i - 1];
  const siguiente = temas[i + 1];

  return (
    <article>
      <Link href="/temas" className="text-sm text-muted hover:text-accent">
        ← Todos los temas
      </Link>
      <div className="font-mono text-sm text-accent mt-4">Dominio {String(tema.orden).padStart(2, "0")}</div>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-1">{tema.titulo}</h1>
      <p className="text-muted text-lg mt-2">{tema.resumen}</p>

      {tema.dias.length > 0 && (
        <p className="text-sm mt-3">
          En el curso:{" "}
          {tema.dias.map((d, k) => (
            <span key={d}>
              {k > 0 && ", "}
              <a className="text-accent underline" href={`${REPO}/dia-${String(d).padStart(2, "0")}/estudiantes`} target="_blank" rel="noreferrer">
                día {d}
              </a>
            </span>
          ))}
        </p>
      )}

      <Markdown className="mt-6">{tema.contenido}</Markdown>

      <section className="mt-12 bg-panel border border-line rounded-xl p-5">
        <h2 className="text-xl font-bold">Practica este tema</h2>
        <p className="text-muted mt-1">
          {tareas} tareas prácticas con pistas, solución y verificación.
        </p>
        <div className="mt-4">
          <BotonLink href={`/practica?dominio=${slug}`}>Ir a las tareas</BotonLink>
        </div>
      </section>

      {opciones.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">Mini quiz</h2>
          <QuizLista preguntas={opciones} />
        </section>
      )}

      <nav className="mt-12 flex justify-between gap-4 text-sm">
        {anterior ? (
          <Link href={`/temas/${anterior.slug}`} className="text-muted hover:text-accent">
            ← {anterior.titulo}
          </Link>
        ) : (
          <span />
        )}
        {siguiente && (
          <Link href={`/temas/${siguiente.slug}`} className="text-muted hover:text-accent text-right">
            {siguiente.titulo} →
          </Link>
        )}
      </nav>
    </article>
  );
}
