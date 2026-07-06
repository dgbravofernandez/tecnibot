import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TecniBot — Asistente Técnico de Máquinas Expendedoras",
  description: "Diagnóstico y reparación paso a paso de máquinas expendedoras",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
