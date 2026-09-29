"use client";

export default function ThemeToggle() {
  function alternar() {
    const raiz = document.documentElement;
    const actual =
      raiz.dataset.theme ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const nuevo = actual === "dark" ? "light" : "dark";
    raiz.dataset.theme = nuevo;
    try {
      localStorage.setItem("ex200-tema", nuevo);
    } catch {}
  }

  return (
    <button onClick={alternar} className="p-2 rounded-md hover:bg-panel-2 text-muted" aria-label="Cambiar tema claro/oscuro">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    </button>
  );
}
