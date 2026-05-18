import { prisma } from "@/lib/prisma";

import TimeTracker from "@/components/time-entries/time-tracker";

import TimeFilters from "@/components/time-entries/time-filters";

import ExportButton from "@/components/time-entries/export-button";

import { createTimeEntry } from "@/actions/time-entry-actions";

import { exportTimeEntries } from "@/actions/export-time-entries";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

type Props = {
  searchParams: Promise<{
    user?: string;
    client?: string;
  }>;
};

export default async function TimeEntriesPage({
  searchParams,
}: Props) {
  const params =
    await searchParams;

  const session =
    await getServerSession(
      authOptions
    );

  const role =
    session?.user?.role;

  // FILTERS
  const selectedUser =
    params.user || "";

  const selectedClient =
    params.client || "";

  // USERS
  const users =
    await prisma.user.findMany({
      orderBy: {
        name: "asc",
      },
    });

  // CLIENTS SEGÚN ROL
  let clients: any[] = [];

  // ADMIN VE TODOS
  if (role === "ADMIN") {
    clients =
      await prisma.client.findMany({
        orderBy: {
          name: "asc",
        },
      });
  }

  // EXECUTIVE Y COLLABORATOR
  else {
    const assignments =
      await prisma.assignment.findMany(
        {
          where: {
            userId:
              session?.user?.id,
          },

          include: {
            client: true,
          },
        }
      );

    clients =
      assignments.map(
        (a) => a.client
      );
  }

  // ENTRIES SEGÚN ROL
  const entries =
    await prisma.timeEntry.findMany({
      where: {
        ...(selectedUser && {
          userId:
            selectedUser,
        }),

        ...(selectedClient && {
          clientId:
            selectedClient,
        }),

        // SOLO ADMIN VE TODO
        ...(role !==
          "ADMIN" && {
          clientId: {
            in: clients.map(
              (c) => c.id
            ),
          },
        }),
      },

      include: {
        user: true,
        client: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 100,
    });

  // KPIS
  const totalMinutes =
    entries.reduce(
      (acc, entry) =>
        acc +
        (entry.duration || 0),
      0
    );

  const totalHours = (
    totalMinutes / 60
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Control de tiempos
        </h1>

        <p className="text-gray-500 mt-2">
          Gestión y seguimiento de actividades y horas trabajadas
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* HOURS */}
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">
            Horas registradas
          </p>

          <h2 className="text-4xl font-bold text-gray-800 mt-3">
            {totalHours}h
          </h2>
        </div>

        {/* ACTIVITIES */}
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">
            Actividades registradas
          </p>

          <h2 className="text-4xl font-bold text-gray-800 mt-3">
            {entries.length}
          </h2>
        </div>
      </div>

      {/* TRACKER SOLO COLLABORATOR */}
      {role ===
        "COLLABORATOR" && (
        <TimeTracker
          clients={clients}
          createTimeEntry={
            createTimeEntry
          }
        />
      )}

      {/* ADMIN PANEL */}
      {role === "ADMIN" && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-blue-800">
            Panel administrativo
          </h2>

          <p className="text-blue-700 mt-2">
            Supervisa productividad, tiempos y actividades de colaboradores.
          </p>
        </div>
      )}

      {/* EXECUTIVE PANEL */}
      {role ===
        "EXECUTIVE" && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-green-800">
            Panel ejecutivo
          </h2>

          <p className="text-green-700 mt-2">
            Visualiza actividades y tiempos relacionados con tus clientes.
          </p>
        </div>
      )}

      {/* FILTERS */}
      <TimeFilters
        users={users}
        clients={clients}
        selectedUser={
          selectedUser
        }
        selectedClient={
          selectedClient
        }
      />

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {/* TABLE HEADER */}
        <div className="p-6 border-b flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Historial actividades
            </h2>

            <p className="text-gray-500 mt-1">
              Últimos registros del sistema
            </p>
          </div>

          {/* EXPORT */}
          <ExportButton
            exportAction={
              exportTimeEntries
            }
          />
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-6 py-4">
                  Usuario
                </th>

                <th className="text-left px-6 py-4">
                  Cliente
                </th>

                <th className="text-left px-6 py-4">
                  Actividad
                </th>

                <th className="text-left px-6 py-4">
                  Entrada
                </th>

                <th className="text-left px-6 py-4">
                  Salida
                </th>

                <th className="text-left px-6 py-4">
                  Tiempo
                </th>

                <th className="text-left px-6 py-4">
                  Estado
                </th>
              </tr>
            </thead>

            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-t hover:bg-gray-50"
                >
                  {/* USER */}
                  <td className="px-6 py-4 font-medium">
                    {entry.user.name}
                  </td>

                  {/* CLIENT */}
                  <td className="px-6 py-4">
                    {entry.client.name}
                  </td>

                  {/* DESCRIPTION */}
                  <td className="px-6 py-4">
                    {entry.description ||
                      "-"}
                  </td>

                  {/* START */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(
                      entry.startTime
                    ).toLocaleString()}
                  </td>

                  {/* END */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.endTime
                      ? new Date(
                          entry.endTime
                        ).toLocaleString()
                      : "-"}
                  </td>

                  {/* DURATION */}
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm">
                      {entry.duration
                        ? `${entry.duration} min`
                        : "-"}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-lg text-sm bg-green-100 text-green-700">
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}

              {entries.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center p-10 text-gray-500"
                  >
                    No existen registros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}