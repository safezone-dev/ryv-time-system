import { prisma } from "@/lib/prisma";

import {
  getServerSession,
} from "next-auth";

import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

export default async function ExecutiveHistoryPage() {
  // SESSION
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

  // =========================
  // ACTIVIDADES CERRADAS
  // =========================

  const closedEntries =
    await prisma.timeEntry.findMany(
      {
        where: {
          userId,

          status:
            "CLOSED",
        },

        include: {
          client: true,
        },

        orderBy: {
          startTime:
            "desc",
        },
      }
    );

  // =========================
  // METRICAS
  // =========================

  const totalActivities =
    closedEntries.length;

  const totalMinutes =
    closedEntries.reduce(
      (acc, entry) =>
        acc +
        (entry.duration || 0),
      0
    );

  const totalHours = (
    totalMinutes / 60
  ).toFixed(1);

  const totalClients =
    new Set(
      closedEntries.map(
        (e) =>
          e.client.name
      )
    ).size;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Historial
        </h1>

        <p className="text-gray-500 mt-2">
          Historial de actividades cerradas
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {/* ACTIVIDADES */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Actividades
          </p>

          <h2 className="text-3xl font-bold text-blue-700 mt-2">
            {
              totalActivities
            }
          </h2>
        </div>

        {/* HORAS */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Horas
          </p>

          <h2 className="text-3xl font-bold text-blue-700 mt-2">
            {totalHours}h
          </h2>
        </div>

        {/* CLIENTES */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Clientes
          </p>

          <h2 className="text-3xl font-bold text-blue-700 mt-2">
            {
              totalClients
            }
          </h2>
        </div>

        {/* MINUTOS */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Minutos
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {
              totalMinutes
            }
          </h2>
        </div>
      </div>

      {/* HISTORIAL */}
      <div className="space-y-6">
        {Object.entries(
          closedEntries.reduce(
            (acc: any, entry) => {
              // MES
              const month =
                new Date(
                  entry.startTime
                ).toLocaleDateString(
                  "es-CR",
                  {
                    year:
                      "numeric",

                    month:
                      "long",
                  }
                );

              // CREAR MES
              if (!acc[month]) {
                acc[month] =
                  {};
              }

              // CLIENTE
              const clientName =
                entry.client
                  .name;

              // CREAR CLIENTE
              if (
                !acc[month][
                  clientName
                ]
              ) {
                acc[month][
                  clientName
                ] = [];
              }

              // PUSH
              acc[month][
                clientName
              ].push(entry);

              return acc;
            },
            {}
          )
        ).map(
          ([month, clients]) => (
            <div
              key={month}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
            >
              {/* MONTH */}
              <div className="bg-blue-700 text-white px-6 py-4">
                <h2 className="text-lg font-bold capitalize">
                  {month}
                </h2>
              </div>

              {/* CLIENTS */}
              <div className="p-6 space-y-6">
                {Object.entries(
                  clients as any
                ).map(
                  (
                    [
                      clientName,
                      entries,
                    ]: any
                  ) => (
                    <div
                      key={
                        clientName
                      }
                      className="border border-gray-200 rounded-2xl overflow-hidden"
                    >
                      {/* CLIENT */}
                      <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                        <h3 className="font-bold text-gray-800">
                          {
                            clientName
                          }
                        </h3>
                      </div>

                      {/* TABLE */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-white">
                            <tr>
                              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                                Actividad
                              </th>

                              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                                Inicio
                              </th>

                              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                                Finalización
                              </th>

                              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                                Duración
                              </th>

                              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                                Observaciones
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {entries.map(
                              (
                                entry: any
                              ) => (
                                <tr
                                  key={
                                    entry.id
                                  }
                                  className="border-t border-gray-100"
                                >
                                  {/* DESCRIPTION */}
                                  <td className="px-6 py-4 text-gray-700">
                                    {
                                      entry.description
                                    }
                                  </td>

                                  {/* START */}
                                  <td className="px-6 py-4 text-gray-600">
                                    {new Date(
                                      entry.startTime
                                    ).toLocaleString(
                                      "es-CR"
                                    )}
                                  </td>

                                  {/* END */}
                                  <td className="px-6 py-4 text-gray-600">
                                    {entry.endTime
                                      ? new Date(
                                          entry.endTime
                                        ).toLocaleString(
                                          "es-CR"
                                        )
                                      : "-"}
                                  </td>

                                  {/* DURATION */}
                                  <td className="px-6 py-4 text-gray-600">
                                    {
                                      entry.duration
                                    }{" "}
                                    min
                                  </td>

                                  {/* NOTES */}
                                  <td className="px-6 py-4 text-gray-600">
                                    {
                                      entry.closingNotes
                                    }
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )
        )}

        {closedEntries.length ===
          0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center text-gray-500">
            No existen actividades cerradas
          </div>
        )}
      </div>
    </div>
  );
}