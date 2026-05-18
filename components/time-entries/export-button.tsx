"use client";

import { useState } from "react";

export default function ExportButton({
  exportAction,
}: any) {
  const [loading, setLoading] =
    useState(false);

  async function handleExport() {
    try {
      setLoading(true);

      const file =
        await exportAction();

      const link =
        document.createElement(
          "a"
        );

      link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${file}`;

      link.download =
        "reporte-tiempos.xlsx";

      link.click();
    } catch (error) {
      console.error(
        error
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={
        handleExport
      }
      disabled={loading}
      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl px-6 py-3 font-semibold"
    >
      {loading
        ? "Exportando..."
        : "Exportar Excel"}
    </button>
  );
}