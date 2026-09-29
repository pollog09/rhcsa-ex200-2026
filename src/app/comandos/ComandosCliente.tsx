"use client";

import { useMemo, useState } from "react";
import type { Comando } from "@/lib/esquema";
import { DOMINIOS } from "@/lib/dominios";
import CodeBlock from "@/components/CodeBlock";
import { boton } from "@/components/ui";

// Quita tildes para que "contrasena" encuentre "contraseña"
const normalizar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function ComandosCliente({ comandos }: { comandos: Comando[] }) {
  const [texto, setTexto] = useState("");
  const [dominio, setDominio] = useState("");

  const filtrados = useMemo(() => {
    const q = normalizar(texto.trim());
    return comandos.filter(
      (c) =>
        (!dominio || c.dominio === dominio) &&
        (!q || normalizar(`${c.comando} ${c.descripcion} ${c.ejemplo}`).includes(q)),
    );
  }, [comandos, texto, dominio]);

  return (
    <>
      <input
        type="search"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Buscar comando o tarea…"
        className="w-full bg-panel border border-line rounded-lg px-4 py-2.5 mb-3"
        aria-label="Buscar comandos"
      />
      <div className="flex flex-wrap gap-2 mb-6">
        <button className={`${boton} ${!dominio ? "!border-accent !text-accent" : ""}`} onClick={() => setDominio("")}>
          Todos
        </button>
        {DOMINIOS.map((d) => (
          <button
            key={d.slug}
            className={`${boton} ${dominio === d.slug ? "!border-accent !text-accent" : ""}`}
            onClick={() => setDominio(d.slug)}
          >
            {d.corto}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted mb-3">{filtrados.length} comandos</p>
      <div className="grid md:grid-cols-2 gap-3">
        {filtrados.map((c, i) => (
          <div key={`${c.comando}-${i}`} className="bg-panel border border-line rounded-xl p-4 min-w-0">
            <div className="font-mono font-semibold text-accent">{c.comando}</div>
            <p className="text-sm mt-1 mb-3">{c.descripcion}</p>
            <CodeBlock>
              <code>{c.ejemplo}</code>
            </CodeBlock>
          </div>
        ))}
      </div>
    </>
  );
}
