"use server";

import { prisma } from "@/lib/prisma";

import { revalidatePath } from "next/cache";

// =========================
// CREAR ACTIVIDAD
// =========================

export async function createTimeEntry(
  formData: FormData
) {
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

          startTime:
            new Date(),

          status:
            "ACTIVE",
        },
      }
    );

    // REFRESH
    revalidatePath(
      "/dashboard/time-entries"
    );

    revalidatePath(
      "/executive/time-entries"
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
    };
  }
}

// =========================
// CERRAR ACTIVIDAD
// =========================

export async function stopTimeEntry(
  formData: FormData
) {
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
      new Date();

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
      "/dashboard/time-entries"
    );

    revalidatePath(
      "/executive/time-entries"
    );

    revalidatePath(
      "/executive/history"
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
    };
  }
}