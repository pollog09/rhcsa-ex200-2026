"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const ENLACES = [
  { href: "/temas", label: "Temas" },
  { href: "/comandos", label: "Comandos" },
  { href: "/practica", label: "Práctica" },
  { href: "/quiz", label: "Quiz" },
  { href: "/simulacro", label: "Simulacro" },
  { href: "/laboratorio", label: "Laboratorio" },
  { href: "/estrategia", label: "Estrategia" },
  { href: "/progreso", label: "Progreso" },
];

export default function Nav() {
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-panel/95 backdrop-blur border-b border-line">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
        <Link href="/" className="font-bold tracking-tight flex items-center gap-2 shrink-0" onClick={() => setAbierto(false)}>
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-accent" aria-hidden />
          RHCSA <span className="text-muted font-medium">EX200</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-1 text-sm ml-auto">
          {ENLACES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className={`px-2.5 py-1.5 rounded-md hover:bg-panel-2 ${
                ruta.startsWith(e.href) ? "text-accent font-semibold" : "text-muted"
              }`}
            >
              {e.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto lg:ml-2 flex items-center gap-1">
          <ThemeToggle />
          <button
            className="lg:hidden p-2 rounded-md hover:bg-panel-2"
            aria-label="Abrir menú"
            aria-expanded={abierto}
            onClick={() => setAbierto(!abierto)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              {abierto ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
            </svg>
          </button>
        </div>
      </div>
      {abierto && (
        <nav className="lg:hidden border-t border-line px-4 py-2 grid grid-cols-2 gap-1 text-sm">
          {ENLACES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              onClick={() => setAbierto(false)}
              className={`px-3 py-2 rounded-md hover:bg-panel-2 ${ruta.startsWith(e.href) ? "text-accent font-semibold" : ""}`}
            >
              {e.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
