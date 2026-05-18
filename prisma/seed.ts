import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash(
    "Admin123*",
    10
  );

  await prisma.user.create({
    data: {
      name: "Administrador",
      email: "admin@ryv.com",
      password,
      role: "ADMIN",
    },
  });

  console.log("Admin creado");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });