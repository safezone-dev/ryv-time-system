import "./globals.css";

import type { Metadata } from "next";

import SessionProviderWrapper from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: "RYV CRM",

  description:
    "RYV CRM Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}