"use server";

import { prisma } from "@/lib/prisma";

import * as XLSX from "xlsx";

export async function exportTimeEntries() {
  const entries =
    await prisma.timeEntry.findMany({
      include: {
        user: true,
        client: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  const data = entries.map(
    (entry) => ({
      Usuario:
        entry.user.name,

      Cliente:
        entry.client.name,

      Actividad:
        entry.description,

      Entrada:
        entry.startTime
          ? new Date(
              entry.startTime
            ).toLocaleString()
          : "",

      Salida:
        entry.endTime
          ? new Date(
              entry.endTime
            ).toLocaleString()
          : "",

      "Duración (min)":
        entry.duration,

      Estado:
        entry.status,
    })
  );

  const worksheet =
    XLSX.utils.json_to_sheet(
      data
    );

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Tiempos"
  );

  const buffer =
    XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

  return Buffer.from(
    buffer
  ).toString("base64");
}