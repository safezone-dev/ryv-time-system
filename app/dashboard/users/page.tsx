import { prisma } from "@/lib/prisma";

import { requireAdmin } from "@/lib/role-guard";

import {
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
} from "@/actions/user-actions";

import UsersTable from "@/components/users/users-table";

export default async function UsersPage() {
  // PROTECCIÓN ADMIN
  await requireAdmin();

  // USERS
  const users =
    await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Usuarios
        </h1>

        <p className="text-gray-500 mt-2">
          Administración de usuarios del sistema
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <UsersTable
          users={users}
          createUser={createUser}
          updateUser={updateUser}
          deleteUser={deleteUser}
          resetUserPassword={
            resetUserPassword
          }
        />
      </div>
    </div>
  );
}