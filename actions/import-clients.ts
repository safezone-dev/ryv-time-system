"use server";

import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";
import { revalidatePath } from "next/cache";

export async function importClients(
  formData: FormData
) {
  try {
    const file = formData.get(
      "file"
    ) as File;

    if (!file) {
      throw new Error(
        "Debe seleccionar un archivo"
      );
    }

    const bytes =
      await file.arrayBuffer();

    const buffer = Buffer.from(
      bytes
    );

    const workbook = XLSX.read(
      buffer,
      {
        type: "buffer",
      }
    );

    const sheetName =
      workbook.SheetNames[0];

    const worksheet =
      workbook.Sheets[sheetName];

    const data: any[] =
      XLSX.utils.sheet_to_json(
        worksheet,
        {
          defval: "",
        }
      );

    let createdRows = 0;
    let updatedRows = 0;
    let skippedRows = 0;

    for (const row of data) {
      // COLUMNAS REALES DEL EXCEL
      const name = String(
        row["CLIENTES"] || ""
      )
        .trim()
        .toUpperCase();

      const contact = String(
        row["CONTACTO"] || ""
      ).trim();

      const phone = String(
        row["TELEFONOS"] || ""
      ).trim();

      const email = String(
        row[
          "CORREO ELECTRONICO"
        ] || ""
      ).trim();

      const advisor = String(
        row["Asesor (a)"] || ""
      ).trim();

      const executive = String(
        row["Ejecutivo Actual"] ||
          ""
      ).trim();

      // VALIDAR NOMBRE
      if (!name) {
        skippedRows++;
        continue;
      }

      // BUSCAR CLIENTE EXISTENTE
      // NORMALIZANDO EL NOMBRE
      const existingClient =
        await prisma.client.findFirst(
          {
            where: {
              name: {
                equals: name,
                mode: "insensitive",
              },
            },
          }
        );

      // ACTUALIZAR
      if (existingClient) {
        await prisma.client.update(
          {
            where: {
              id: existingClient.id,
            },

            data: {
              contact,
              phone,
              email,
              advisor,
              executive,
            },
          }
        );

        updatedRows++;
      }

      // CREAR
      else {
        await prisma.client.create(
          {
            data: {
              name,
              contact,
              phone,
              email,
              advisor,
              executive,
            },
          }
        );

        createdRows++;
      }
    }

    // GUARDAR LOG
    await prisma.importLog.create({
      data: {
        fileName: file.name,
        totalRows: data.length,
        createdRows,
        updatedRows,
        skippedRows,
      },
    });

    revalidatePath(
      "/dashboard/clients"
    );

    revalidatePath(
      "/dashboard/imports"
    );

    return {
      success: true,
      totalRows: data.length,
      createdRows,
      updatedRows,
      skippedRows,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      totalRows: 0,
      createdRows: 0,
      updatedRows: 0,
      skippedRows: 0,
    };
  }
}