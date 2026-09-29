export type Dominio = {
  slug: string;
  titulo: string;
  corto: string;
};

// Los 10 dominios oficiales del EX200 (RHEL 10), en el orden de Red Hat
export const DOMINIOS: Dominio[] = [
  { slug: "herramientas-esenciales", titulo: "Herramientas esenciales", corto: "Herramientas" },
  { slug: "software", titulo: "Gestionar software", corto: "Software" },
  { slug: "scripts", titulo: "Scripts de shell", corto: "Scripts" },
  { slug: "sistemas-en-ejecucion", titulo: "Operar sistemas en ejecución", corto: "Operar" },
  { slug: "almacenamiento-local", titulo: "Almacenamiento local", corto: "Almacenamiento" },
  { slug: "sistemas-de-archivos", titulo: "Sistemas de archivos", corto: "Filesystems" },
  { slug: "despliegue-mantenimiento", titulo: "Desplegar y mantener", corto: "Mantenimiento" },
  { slug: "redes", titulo: "Redes básicas", corto: "Redes" },
  { slug: "usuarios-grupos", titulo: "Usuarios y grupos", corto: "Usuarios" },
  { slug: "seguridad", titulo: "Seguridad", corto: "Seguridad" },
];

export const DOMINIO_SLUGS = DOMINIOS.map((d) => d.slug);

export function tituloDominio(slug: string): string {
  return DOMINIOS.find((d) => d.slug === slug)?.titulo ?? slug;
}
