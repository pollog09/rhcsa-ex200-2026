import Link from "next/link";

const DIFICULTAD: Record<string, { texto: string; clase: string }> = {
  facil: { texto: "Fácil", clase: "bg-ok-soft text-ok" },
  media: { texto: "Media", clase: "bg-warn-soft text-warn" },
  dificil: { texto: "Difícil", clase: "bg-bad-soft text-bad" },
};

export function BadgeDificultad({ nivel }: { nivel: string }) {
  const d = DIFICULTAD[nivel] ?? DIFICULTAD.media;
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${d.clase}`}>{d.texto}</span>;
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-panel-2 text-muted border border-line">
      {children}
    </span>
  );
}

export function Encabezado({ titulo, children }: { titulo: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{titulo}</h1>
      {children && <p className="mt-3 text-muted text-lg max-w-3xl">{children}</p>}
    </div>
  );
}

export function Tarjeta({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-panel border border-line rounded-xl p-5 ${className}`}>{children}</div>;
}

export function BotonLink({ href, children, secundario = false }: { href: string; children: React.ReactNode; secundario?: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-sm ${
        secundario ? "border border-line bg-panel hover:bg-panel-2" : "bg-accent text-white hover:opacity-90"
      }`}
    >
      {children}
    </Link>
  );
}

export function Barra({ valor, total }: { valor: number; total: number }) {
  const pct = total ? Math.round((valor / total) * 100) : 0;
  return (
    <div className="h-2 rounded-full bg-panel-2 overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full bg-ok transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

export const boton =
  "inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium border border-line bg-panel hover:bg-panel-2 disabled:opacity-50";
export const botonPrimario =
  "inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-accent text-white hover:opacity-90 disabled:opacity-50";
