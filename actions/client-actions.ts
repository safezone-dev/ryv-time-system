"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createClient(formData: FormData) {
  const name = formData.get("name") as string;
  const contact = formData.get("contact") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;

  if (!name) {
    throw new Error("El nombre del cliente es requerido");
  }

  await prisma.client.create({
    data: {
      name,
      contact,
      phone,
      email,
    },
  });

  revalidatePath("/dashboard/clients");
}

export async function updateClient(formData: FormData) {
  const id = formData.get("id") as string;

  const name = formData.get("name") as string;
  const contact = formData.get("contact") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;

  if (!id) {
    throw new Error("ID del cliente requerido");
  }

  if (!name) {
    throw new Error("El nombre del cliente es requerido");
  }

  await prisma.client.update({
    where: {
      id,
    },

    data: {
      name,
      contact,
      phone,
      email,
    },
  });

  revalidatePath("/dashboard/clients");
}

export async function deleteClient(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("ID del cliente requerido");
  }

  // Elimina primero relaciones si existen
  await prisma.assignment.deleteMany({
    where: {
      clientId: id,
    },
  });

  await prisma.timeEntry.deleteMany({
    where: {
      clientId: id,
    },
  });

  // Luego elimina cliente
  await prisma.client.delete({
    where: {
      id,
    },
  });

  revalidatePath("/dashboard/clients");
}