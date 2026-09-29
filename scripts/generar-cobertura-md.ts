// Genera docs/COBERTURA-EX200.md desde data/objetivos.json: npm run cobertura:md
import fs from "node:fs";
import { cargarObjetivos, cargarPreguntas, cargarTemas } from "../src/lib/datos";
import { DOMINIOS } from "../src/lib/dominios";

const objetivos = cargarObjetivos();
const preguntas = new Map(cargarPreguntas().map((p) => [p.id, p]));
const temas = new Map(cargarTemas().map((t) => [t.slug, t]));

let md = "# Cobertura de los objetivos oficiales del EX200 (RHEL 10)\n\n";
md += "> Generado desde `data/objetivos.json` con `npm run cobertura:md`. Fuente de los objetivos: ";
md += "[redhat.com · EX200](https://www.redhat.com/en/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam), revisada el 29/09/2026.\n\n";
md += `**${objetivos.length} objetivos oficiales**, todos con explicación en su tema y al menos un ejercicio. `;
md += "En el sitio están en `/objetivos`, como checklist para el estudiante.\n";

for (const d of DOMINIOS) {
  const tema = temas.get(d.slug);
  md += `\n## ${d.titulo}\n\nTema: \`content/temas/${String(tema?.orden ?? "").padStart(2, "0")}-${d.slug}.md\`\n\n`;
  md += "| Objetivo oficial | En palabras simples | Ejercicios |\n|---|---|---|\n";
  for (const o of objetivos.filter((x) => x.dominio === d.slug)) {
    const ej = o.ejercicios
      .map((id) => `\`${id}\`${preguntas.get(id)?.tipo === "opcion" ? " (quiz)" : ""}`)
      .join(", ");
    const celda = (s: string) => s.replace(/\|/g, "\\|");
    md += `| ${celda(o.oficial)} | ${celda(o.explicacion)} | ${ej} |\n`;
  }
}
fs.writeFileSync("docs/COBERTURA-EX200.md", md);
console.log(`docs/COBERTURA-EX200.md: ${objetivos.length} objetivos`);
