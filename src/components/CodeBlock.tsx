"use client";

import { useRef, useState } from "react";

// Bloque <pre> con botón para copiar el texto al portapapeles
export default function CodeBlock({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLPreElement>(null);
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(ref.current?.innerText ?? "");
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    } catch {}
  }

  return (
    <div className={`relative group ${className}`}>
      <pre
        ref={ref}
        className="bg-[var(--code-bg)] text-[var(--code-fg)] font-mono text-[0.85rem] leading-relaxed rounded-lg p-4 pr-16 overflow-x-auto"
      >
        {children}
      </pre>
      <button
        onClick={copiar}
        className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-white/10 text-white/80 hover:bg-white/20"
      >
        {copiado ? "Copiado" : "Copiar"}
      </button>
    </div>
  );
}
