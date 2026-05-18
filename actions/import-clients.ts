"use server";

import { prisma } from "@/lib/prisma";

import * as XLSX from "xlsx";

import bcrypt from "bcryptjs";

import { revalidatePath } from "next/cache";

export async function importClients(
  formData: FormData
): Promise<void> {
  try {
    const file = formData.get(
      "file"
    ) as File;

    if (!file) {
      throw new Error(
        "Debe seleccionar un archivo"
      );
    }

    // LEER ARCHIVO
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

    // RECORRER FILAS
    for (const row of data) {
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
      )
        .trim()
        .toLowerCase();

      const advisor = String(
        row["Asesor (a)"] || ""
      ).trim();

      const executiveName =
        String(
          row[
            "Ejecutivo Actual"
          ] || ""
        ).trim();

      // VALIDAR
      if (!name) {
        skippedRows++;
        continue;
      }

      // BUSCAR CLIENTE
      let client =
        await prisma.client.findFirst(
          {
            where: {
              name: {
                equals: name,
                mode:
                  "insensitive",
              },
            },
          }
        );

      // ACTUALIZAR
      if (client) {
        client =
          await prisma.client.update(
            {
              where: {
                id: client.id,
              },

              data: {
                contact,
                phone,
                email,
                advisor,
                executive:
                  executiveName,
              },
            }
          );

        updatedRows++;
      }

      // CREAR
      else {
        client =
          await prisma.client.create(
            {
              data: {
                name,
                contact,
                phone,
                email,
                advisor,
                executive:
                  executiveName,

                active: true,
              },
            }
          );

        createdRows++;
      }

      // EXECUTIVE
      if (executiveName) {
        const executiveEmail =
          executiveName
            .toLowerCase()
            .replace(
              /\s+/g,
              "."
            ) +
          "@ryvcrm.com";

        // BUSCAR EXECUTIVE
        let executiveUser =
          await prisma.user.findFirst(
            {
              where: {
                OR: [
                  {
                    email:
                      executiveEmail,
                  },

                  {
                    name: {
                      equals:
                        executiveName,

                      mode:
                        "insensitive",
                    },
                  },
                ],

                role:
                  "EXECUTIVE",
              },
            }
          );

        // CREAR EXECUTIVE
        if (!executiveUser) {
          const hashedPassword =
            await bcrypt.hash(
              "Ryv2025*",
              10
            );

          executiveUser =
            await prisma.user.create(
              {
                data: {
                  name:
                    executiveName,

                  email:
                    executiveEmail,

                  password:
                    hashedPassword,

                  role:
                    "EXECUTIVE",

                  active: true,
                },
              }
            );
        }

        // VALIDAR ASSIGNMENT
        const existingAssignment =
          await prisma.assignment.findFirst(
            {
              where: {
                userId:
                  executiveUser.id,

                clientId:
                  client.id,
              },
            }
          );

        // CREAR ASSIGNMENT
        if (
          !existingAssignment
        ) {
          await prisma.assignment.create(
            {
              data: {
                userId:
                  executiveUser.id,

                clientId:
                  client.id,
              },
            }
          );
        }
      }
    }

    // LOG
    await prisma.importLog.create({
      data: {
        fileName: file.name,

        totalRows: data.length,

        createdRows,

        updatedRows,

        skippedRows,
      },
    });

    // REVALIDAR
    revalidatePath(
      "/dashboard"
    );

    revalidatePath(
      "/dashboard/users"
    );

    revalidatePath(
      "/dashboard/clients"
    );

    revalidatePath(
      "/dashboard/imports"
    );

    revalidatePath(
      "/dashboard/assignments"
    );
  } catch (error) {
    console.error(error);

    throw new Error(
      "Error importando clientes"
    );
  }
}