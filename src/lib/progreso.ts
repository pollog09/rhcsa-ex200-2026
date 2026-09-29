"use client";

import { useSyncExternalStore } from "react";

// Progreso del estudiante, guardado solo en este navegador (localStorage).
export type Progreso = {
  tareas: Record<string, boolean>; // id -> marcada como hecha
  quiz: Record<string, boolean>; // id -> ¿acertó la última vez?
  objetivos: Record<string, boolean>; // objetivo oficial -> marcado como dominado
  simulacros: { fecha: string; puntaje: number; aprobado: boolean }[];
};

const CLAVE = "ex200-progreso-v1";
const VACIO: Progreso = { tareas: {}, quiz: {}, objetivos: {}, simulacros: [] };

let cache: Progreso | null = null;
const oyentes = new Set<() => void>();

function leer(): Progreso {
  if (cache) return cache;
  try {
    const crudo = localStorage.getItem(CLAVE);
    cache = crudo ? { ...VACIO, ...JSON.parse(crudo) } : VACIO;
  } catch {
    cache = VACIO;
  }
  return cache!;
}

function escribir(p: Progreso) {
  cache = p;
  try {
    localStorage.setItem(CLAVE, JSON.stringify(p));
  } catch {
    // modo privado o almacenamiento bloqueado: el progreso vive solo en memoria
  }
  oyentes.forEach((o) => o());
}

function suscribir(o: () => void) {
  oyentes.add(o);
  return () => oyentes.delete(o);
}

export function useProgreso(): Progreso {
  return useSyncExternalStore(suscribir, leer, () => VACIO);
}

export function marcarTarea(id: string, hecha: boolean) {
  const p = leer();
  escribir({ ...p, tareas: { ...p.tareas, [id]: hecha } });
}

export function marcarObjetivo(id: string, dominado: boolean) {
  const p = leer();
  escribir({ ...p, objetivos: { ...p.objetivos, [id]: dominado } });
}

export function registrarQuiz(id: string, acierto: boolean) {
  const p = leer();
  escribir({ ...p, quiz: { ...p.quiz, [id]: acierto } });
}

export function registrarSimulacro(puntaje: number) {
  const p = leer();
  const nuevo = { fecha: new Date().toISOString(), puntaje, aprobado: puntaje >= 210 };
  escribir({ ...p, simulacros: [nuevo, ...p.simulacros].slice(0, 20) });
}

export function reiniciarProgreso() {
  escribir(VACIO);
}

// Guardado genérico para estado de páginas (p. ej. el simulacro en curso)
export function guardarLocal<T>(clave: string, valor: T | null) {
  try {
    if (valor === null) localStorage.removeItem(clave);
    else localStorage.setItem(clave, JSON.stringify(valor));
  } catch {}
}

export function leerLocal<T>(clave: string): T | null {
  try {
    const v = localStorage.getItem(clave);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}
