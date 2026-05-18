import { prisma } from "@/lib/prisma";

import {
  getServerSession,
} from "next-auth";

import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

export default async function ExecutiveDashboardPage() {
  const session =
    await getServerSession(
      authOptions
    );

  if (!session) {
    redirect(
      "/executive/login"
    );
  }

  const userId =
    session.user.id;

  // CLIENTES
  const assignments =
    await prisma.assignment.findMany(
      {
        where: {
          userId,
        },

        include: {
          client: true,
        },
      }
    );

  const clients =
    assignments.map(
      (a) => a.client
    );

  // ACTIVIDADES
  const entries =
    await prisma.timeEntry.findMany(
      {
        where: {
          userId,
        },
      }
    );

  const activeEntries =
    entries.filter(
      (e) =>
        e.status ===
        "ACTIVE"
    );

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
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard Ejecutivo
        </h1>

        <p className="text-gray-500 mt-2">
          Bienvenido{" "}
          <span className="font-semibold">
            {
              session.user
                .name
            }
          </span>
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {/* HORAS */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Horas
          </p>

          <h2 className="text-3xl font-bold text-blue-700 mt-2">
            {totalHours}h
          </h2>
        </div>

        {/* ACTIVIDADES */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Actividades
          </p>

          <h2 className="text-3xl font-bold text-blue-700 mt-2">
            {entries.length}
          </h2>
        </div>

        {/* CLIENTES */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Clientes
          </p>

          <h2 className="text-3xl font-bold text-blue-700 mt-2">
            {clients.length}
          </h2>
        </div>

        {/* ACTIVAS */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Activas
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {
              activeEntries.length
            }
          </h2>
        </div>
      </div>

      {/* ACTIVIDADES */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Actividades recientes
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Historial de actividades
          </p>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Estado
                </th>

                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Inicio
                </th>

                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Duración
                </th>
              </tr>
            </thead>

            <tbody>
              {entries.map(
                (entry) => (
                  <tr
                    key={entry.id}
                    className="border-t border-gray-100"
                  >
                    {/* STATUS */}
                    <td className="px-6 py-4">
                      {entry.status ===
                      "ACTIVE" ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-semibold">
                          ACTIVA
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs font-semibold">
                          CERRADA
                        </span>
                      )}
                    </td>

                    {/* START */}
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(
                        entry.startTime
                      ).toLocaleString(
                        "es-CR"
                      )}
                    </td>

                    {/* DURATION */}
                    <td className="px-6 py-4 text-gray-600">
                      {
                        entry.duration
                      }{" "}
                      min
                    </td>
                  </tr>
                )
              )}

              {entries.length ===
                0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-10 text-gray-500"
                  >
                    No existen actividades
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