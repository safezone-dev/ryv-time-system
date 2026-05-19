"use server";

import { toZonedTime } from "date-fns-tz";

import { prisma } from "@/lib/prisma";

import { revalidatePath } from "next/cache";

// =========================
// CREAR ACTIVIDAD
// =========================

export async function createExecutiveActivity(
  formData: FormData
): Promise<void> {
  try {
    const userId = String(
      formData.get("userId")
    );

    const clientId = String(
      formData.get("clientId")
    );

    const description =
      String(
        formData.get(
          "description"
        )
      );

    // VALIDACIONES
    if (
      !userId ||
      !clientId ||
      !description
    ) {
      throw new Error(
        "Faltan datos"
      );
    }

    // CREAR ACTIVIDAD
    await prisma.timeEntry.create(
      {
        data: {
          userId,

          clientId,

          description,

          startTime: toZonedTime(
            new Date(),
            "America/Costa_Rica"
          ),

          status:
            "ACTIVE",
        },
      }
    );

    // REFRESH
    revalidatePath(
      "/executive/time-entries"
    );

    revalidatePath(
      "/executive/dashboard"
    );
  } catch (error) {
    console.error(error);

    throw error;
  }
}

// =========================
// CERRAR ACTIVIDAD
// =========================

export async function closeExecutiveActivity(
  formData: FormData
): Promise<void> {
  try {
    const entryId = String(
      formData.get(
        "entryId"
      )
    );

    const closingNotes =
      String(
        formData.get(
          "closingNotes"
        ) || ""
      );

    // BUSCAR ACTIVIDAD
    const entry =
      await prisma.timeEntry.findUnique(
        {
          where: {
            id: entryId,
          },
        }
      );

    if (!entry) {
      throw new Error(
        "Actividad no encontrada"
      );
    }

    // FECHA FINAL
    const endTime =
  toZonedTime(
    new Date(),
    "America/Costa_Rica"
  );

    // CALCULAR DURACION
    const duration =
      Math.floor(
        (endTime.getTime() -
          entry.startTime.getTime()) /
          1000 /
          60
      );

    // ACTUALIZAR
    await prisma.timeEntry.update(
      {
        where: {
          id: entryId,
        },

        data: {
          endTime,

          duration,

          closingNotes,

          status:
            "CLOSED",
        },
      }
    );

    // REFRESH
    revalidatePath(
      "/executive/time-entries"
    );

    revalidatePath(
      "/executive/history"
    );

    revalidatePath(
      "/executive/dashboard"
    );
  } catch (error) {
    console.error(error);

    throw error;
  }
}