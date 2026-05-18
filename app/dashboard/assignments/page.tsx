import { prisma } from "@/lib/prisma";

import { requireAdmin } from "@/lib/role-guard";

import AssignmentsPageClient from "@/components/assignments/assignments-page-client";

export default async function AssignmentsPage() {
  // PROTEGER SOLO ADMIN
  await requireAdmin();

  // USERS
  const users =
    await prisma.user.findMany({
      orderBy: {
        name: "asc",
      },
    });

  // CLIENTS
  const clients =
    await prisma.client.findMany({
      orderBy: {
        name: "asc",
      },
    });

  // ASSIGNMENTS
  const assignments =
    await prisma.assignment.findMany({
      include: {
        user: true,
        client: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <AssignmentsPageClient
      users={users}
      clients={clients}
      assignments={
        assignments
      }
    />
  );
}