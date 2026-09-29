// Genera COMANDOS.md a partir de data/comandos.json: npm run comandos:md
import fs from "node:fs";
import { cargarComandos } from "../src/lib/datos";
import { DOMINIOS } from "../src/lib/dominios";

const comandos = cargarComandos();
let md = "# Chuleta de comandos RHCSA EX200 (RHEL 10)\n\n";
md += "> Archivo generado desde `data/comandos.json` con `npm run comandos:md`. También disponible con buscador en `/comandos` del sitio.\n\n";
md += DOMINIOS.map((d) => `- [${d.titulo}](#${d.slug})`).join("\n") + "\n";

for (const d of DOMINIOS) {
  md += `\n<a id="${d.slug}"></a>\n\n## ${d.titulo}\n\n| Comando | Para qué sirve | Ejemplo |\n|---|---|---|\n`;
  for (const c of comandos.filter((x) => x.dominio === d.slug)) {
    const celda = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");
    md += `| \`${celda(c.comando)}\` | ${celda(c.descripcion)} | \`${celda(c.ejemplo)}\` |\n`;
  }
}
fs.writeFileSync("COMANDOS.md", md);
console.log(`COMANDOS.md: ${comandos.length} comandos`);
