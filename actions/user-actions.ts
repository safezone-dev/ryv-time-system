"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function createUser(
  formData: FormData
) {
  try {
    const name = String(
      formData.get("name") || ""
    ).trim();

    const email = String(
      formData.get("email") || ""
    )
      .trim()
      .toLowerCase();

    const password = String(
      formData.get("password") || ""
    ).trim();

    const role = String(
      formData.get("role") || ""
    ).trim();

    if (
      !name ||
      !email ||
      !password
    ) {
      throw new Error(
        "Campos requeridos"
      );
    }

    // VALIDAR EMAIL EXISTENTE
    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      throw new Error(
        "El usuario ya existe"
      );
    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // CREAR USUARIO
    await prisma.user.create({
      data: {
        name,
        email,
        password:
          hashedPassword,
        role: role as any,
        active: true,
      },
    });

    revalidatePath(
      "/dashboard/users"
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

export async function updateUser(
  formData: FormData
) {
  try {
    const id = String(
      formData.get("id") || ""
    );

    const name = String(
      formData.get("name") || ""
    ).trim();

    const email = String(
      formData.get("email") || ""
    )
      .trim()
      .toLowerCase();

    const role = String(
      formData.get("role") || ""
    ).trim();

    const active =
      formData.get("active") ===
      "true";

    if (!id) {
      throw new Error(
        "Usuario inválido"
      );
    }

    await prisma.user.update({
      where: {
        id,
      },

      data: {
        name,
        email,
        role: role as any,
        active,
      },
    });

    revalidatePath(
      "/dashboard/users"
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

export async function deleteUser(
  formData: FormData
) {
  try {
    const id = String(
      formData.get("id") || ""
    );

    if (!id) {
      throw new Error(
        "Usuario inválido"
      );
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    revalidatePath(
      "/dashboard/users"
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

export async function resetUserPassword(
  formData: FormData
) {
  try {
    const id = String(
      formData.get("id") || ""
    );

    const password = String(
      formData.get("password") || ""
    ).trim();

    if (!id || !password) {
      throw new Error(
        "Datos inválidos"
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    await prisma.user.update({
      where: {
        id,
      },

      data: {
        password:
          hashedPassword,
      },
    });

    revalidatePath(
      "/dashboard/users"
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