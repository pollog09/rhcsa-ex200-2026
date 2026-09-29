import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-sans-var" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono-var" });

export const metadata: Metadata = {
  title: { default: "RHCSA EX200 · Guía de estudio", template: "%s · RHCSA EX200" },
  description:
    "Resumen, comandos y exámenes de práctica interactivos para aprobar el RHCSA EX200 (RHEL 10).",
};

// Aplica el tema guardado antes de pintar, para evitar el parpadeo
const temaScript = `try{var t=localStorage.getItem('ex200-tema');if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: temaScript }} />
      </head>
      <body className={`${sans.variable} ${mono.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <Nav />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">{children}</main>
        <footer className="border-t border-line text-sm text-muted">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row gap-2 justify-between">
            <span>Material de estudio independiente. No afiliado a Red Hat.</span>
            <a className="underline" href="https://github.com/Distriib/curso-linux" target="_blank" rel="noreferrer">
              Basado en el curso Distriib/curso-linux
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
