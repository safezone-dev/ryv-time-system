import { prisma } from "@/lib/prisma";

import { requireAdmin } from "@/lib/role-guard";

import {
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
} from "@/actions/user-actions";

import UsersTable from "@/components/users/users-table";

interface Props {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function UsersPage({
  searchParams,
}: Props) {
  // PROTECCIÓN ADMIN
  await requireAdmin();

  // PAGE
  const params =
    await searchParams;

  const currentPage =
    Number(
      params.page || 1
    );

  const perPage = 10;

  const skip =
    (currentPage - 1) *
    perPage;

  // TOTAL
  const totalUsers =
    await prisma.user.count();

  const totalPages =
    Math.ceil(
      totalUsers /
        perPage
    );

  // USERS
  const users =
    await prisma.user.findMany(
      {
        orderBy: {
          createdAt:
            "desc",
        },

        skip,

        take: perPage,
      }
    );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Usuarios
            </h1>

            <p className="text-gray-500 mt-2">
              Administración de usuarios del sistema
            </p>
          </div>

          {/* STATS */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4">
            <p className="text-xs uppercase tracking-wide text-blue-600">
              Total usuarios
            </p>

            <h2 className="text-3xl font-bold text-blue-700 mt-1">
              {
                totalUsers
              }
            </h2>
          </div>
        </div>
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

      {/* PAGINATION */}
      <div className="bg-white rounded-2xl shadow p-5">
        <div className="flex items-center justify-between">
          {/* INFO */}
          <div className="text-sm text-gray-500">
            Página{" "}
            <span className="font-semibold text-gray-700">
              {currentPage}
            </span>{" "}
            de{" "}
            <span className="font-semibold text-gray-700">
              {totalPages}
            </span>
          </div>

          {/* BUTTONS */}
          <div className="flex items-center gap-3">
            {/* PREV */}
            <a
              href={`/dashboard/users?page=${
                currentPage - 1
              }`}
              className={`
                px-4
                py-2
                rounded-xl
                text-sm
                font-medium
                transition
                ${
                  currentPage <=
                  1
                    ? "bg-gray-100 text-gray-400 pointer-events-none"
                    : "bg-blue-700 text-white hover:bg-blue-800"
                }
              `}
            >
              Anterior
            </a>

            {/* NEXT */}
            <a
              href={`/dashboard/users?page=${
                currentPage + 1
              }`}
              className={`
                px-4
                py-2
                rounded-xl
                text-sm
                font-medium
                transition
                ${
                  currentPage >=
                  totalPages
                    ? "bg-gray-100 text-gray-400 pointer-events-none"
                    : "bg-blue-700 text-white hover:bg-blue-800"
                }
              `}
            >
              Siguiente
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}