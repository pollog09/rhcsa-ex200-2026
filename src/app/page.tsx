import Link from "next/link";
import { cargarComandos, cargarPreguntas, cargarTemas } from "@/lib/datos";
import { BotonLink, Tarjeta } from "@/components/ui";

// Ruta de estudio sugerida, alineada con los días del curso Distriib/curso-linux
const RUTA = [
  { dia: "1-2", texto: "Herramientas esenciales: archivos, redirección, grep, tar, enlaces", slug: "herramientas-esenciales" },
  { dia: "3", texto: "Usuarios, grupos, sudo y permisos", slug: "usuarios-grupos" },
  { dia: "4", texto: "Procesos, servicios, logs y software (dnf, Flatpak)", slug: "sistemas-en-ejecucion" },
  { dia: "5", texto: "Redes con nmcli, hostname y SSH por clave", slug: "redes" },
  { dia: "6", texto: "Particiones GPT, LVM, swap y fstab", slug: "almacenamiento-local" },
  { dia: "7", texto: "Scripts de shell, cron, at y timers", slug: "scripts" },
  { dia: "8", texto: "firewalld y SELinux", slug: "seguridad" },
  { dia: "9", texto: "NFS, autofs, XFS/ext4/VFAT y extender LVs", slug: "sistemas-de-archivos" },
  { dia: "10", texto: "Arranque, targets, root, bootloader, chrony y tuned", slug: "despliegue-mantenimiento" },
];

const PASOS = [
  { href: "/temas", titulo: "1. Lee el tema", texto: "Resúmenes cortos y en palabras simples de cada objetivo oficial." },
  { href: "/comandos", titulo: "2. Ten la chuleta a mano", texto: "Comandos con ejemplos listos para copiar, con buscador." },
  { href: "/practica", titulo: "3. Practica en tu VM", texto: "Tareas estilo examen con pistas, solución y verificación." },
  { href: "/quiz", titulo: "4. Repasa con el quiz", texto: "Preguntas de opción múltiple que te corrigen al instante." },
  { href: "/simulacro", titulo: "5. Haz un simulacro", texto: "15 tareas, 3 horas y nota final sobre 300, como el día real." },
];

export default function Home() {
  const preguntas = cargarPreguntas();
  const tareas = preguntas.filter((p) => p.tipo === "tarea").length;

  return (
    <>
      <section className="py-6 sm:py-10">
        <p className="font-mono text-sm text-accent">RHCSA · EX200 · RHEL 10 · 2026</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mt-3 max-w-3xl">
          Todo lo que necesitas para aprobar el RHCSA, explicado simple.
        </h1>
        <p className="text-lg text-muted mt-4 max-w-2xl">
          Resúmenes de los 10 dominios oficiales, {cargarComandos().length} comandos con ejemplos y {preguntas.length}{" "}
          ejercicios originales ({tareas} tareas prácticas) para entrenar como en el examen real.
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <BotonLink href="/temas">Empezar a estudiar</BotonLink>
          <BotonLink href="/simulacro" secundario>
            Hacer un simulacro
          </BotonLink>
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4 mt-4">
        <Tarjeta>
          <div className="text-sm text-muted">Formato</div>
          <div className="text-xl font-semibold mt-1">100% práctico</div>
          <p className="text-sm text-muted mt-1">Tareas reales en máquinas virtuales. Sin opción múltiple.</p>
        </Tarjeta>
        <Tarjeta>
          <div className="text-sm text-muted">Para aprobar</div>
          <div className="text-xl font-semibold mt-1">210 / 300</div>
          <p className="text-sm text-muted mt-1">Todo se corrige después de reiniciar: la persistencia cuenta.</p>
        </Tarjeta>
        <Tarjeta>
          <div className="text-sm text-muted">Duración</div>
          <div className="text-xl font-semibold mt-1">~3 horas</div>
          <p className="text-sm text-muted mt-1">Sin internet: solo man, info y /usr/share/doc.</p>
        </Tarjeta>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold mb-4">Cómo usar este sitio</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PASOS.map((p) => (
            <Link key={p.href} href={p.href} className="bg-panel border border-line rounded-xl p-4 hover:border-accent">
              <div className="font-semibold">{p.titulo}</div>
              <p className="text-sm text-muted mt-1">{p.texto}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold mb-1">Ruta de estudio</h2>
        <p className="text-muted mb-4">Sigue el orden del curso: cada paso se apoya en el anterior.</p>
        <ol className="border-l-2 border-line ml-2">
          {RUTA.map((r) => (
            <li key={r.dia} className="relative pl-6 pb-5 last:pb-0">
              <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-accent" aria-hidden />
              <div className="font-mono text-xs text-muted">Día {r.dia}</div>
              <Link href={`/temas/${r.slug}`} className="hover:text-accent">
                {r.texto}
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold mb-4">Los 10 dominios</h2>
        <div className="flex flex-wrap gap-2">
          {cargarTemas().map((t) => (
            <Link key={t.slug} href={`/temas/${t.slug}`} className="px-3 py-1.5 rounded-full border border-line bg-panel text-sm hover:border-accent">
              {t.titulo}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
