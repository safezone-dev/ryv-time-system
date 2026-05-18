"use server";

import { prisma } from "@/lib/prisma";

import { revalidatePath } from "next/cache";

export async function createAssignment(
  formData: FormData
) {
  const userId = String(
    formData.get("userId")
  );

  const clientId = String(
    formData.get("clientId")
  );

  // VALIDAR DUPLICADO
  const exists =
    await prisma.assignment.findFirst(
      {
        where: {
          userId,
          clientId,
        },
      }
    );

  if (exists) {
    throw new Error(
      "La asignación ya existe"
    );
  }

  await prisma.assignment.create({
    data: {
      userId,
      clientId,
    },
  });

  revalidatePath(
    "/dashboard/assignments"
  );

  return {
    success: true,
  };
}

export async function deleteAssignment(
  id: string
) {
  await prisma.assignment.delete({
    where: { id },
  });

  revalidatePath(
    "/dashboard/assignments"
  );

  return {
    success: true,
  };
}