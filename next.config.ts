import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // En Docker (NEXT_OUTPUT=standalone) se genera un servidor mínimo en .next/standalone.
  // En modo nativo se usa el "next start" normal.
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
};

export default nextConfig;
