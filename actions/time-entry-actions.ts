"use server";

import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import { revalidatePath } from "next/cache";

export async function createTimeEntry(
  formData: FormData
) {
  const session =
    await getServerSession(
      authOptions
    );

  if (!session?.user?.id) {
    throw new Error(
      "No autorizado"
    );
  }

  const clientId = String(
    formData.get("clientId")
  );

  const description = String(
    formData.get(
      "description"
    ) || ""
  );

  const date = String(
    formData.get("date")
  );

  const startTimeString = String(
    formData.get("startTime")
  );

  const endTimeString = String(
    formData.get("endTime")
  );

  // FECHAS
  const startTime =
    new Date(
      `${date}T${startTimeString}`
    );

  const endTime =
    new Date(
      `${date}T${endTimeString}`
    );

  // DURACION EN MINUTOS
  const duration =
    Math.floor(
      (endTime.getTime() -
        startTime.getTime()) /
        1000 /
        60
    );

  // VALIDAR
  if (duration <= 0) {
    throw new Error(
      "Hora salida inválida"
    );
  }

  await prisma.timeEntry.create({
    data: {
      userId:
        session.user.id,

      clientId,

      description,

      startTime,

      endTime,

      duration,

      status: "FINISHED",
    },
  });

  revalidatePath(
    "/dashboard/time-entries"
  );

  return {
    success: true,
  };
}