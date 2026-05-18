import { prisma } from "@/lib/prisma";

import DashboardCharts from "@/components/dashboard/dashboard-charts";

export default async function DashboardPage() {
  // CLIENTES
  const clients =
    await prisma.client.count({
      where: {
        active: true,
      },
    });

  // USERS
  const users =
    await prisma.user.count({
      where: {
        active: true,
      },
    });

  // ENTRIES
  const entries =
    await prisma.timeEntry.findMany({
      include: {
        user: true,
        client: true,
      },
    });

  // TOTAL HOURS
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

  // USER CHART
  const userMap =
    new Map();

  entries.forEach((entry) => {
    const name =
      entry.user.name;

    const hours =
      (entry.duration || 0) /
      60;

    userMap.set(
      name,
      (userMap.get(name) ||
        0) + hours
    );
  });

  const userData =
    Array.from(
      userMap.entries()
    ).map(
      ([name, hours]) => ({
        name,
        hours:
          Number(hours.toFixed(
            1
          )),
      })
    );

  // CLIENT CHART
  const clientMap =
    new Map();

  entries.forEach((entry) => {
    const name =
      entry.client.name;

    const hours =
      (entry.duration || 0) /
      60;

    clientMap.set(
      name,
      (clientMap.get(name) ||
        0) + hours
    );
  });

  const clientData =
    Array.from(
      clientMap.entries()
    ).map(
      ([name, hours]) => ({
        name,
        hours:
          Number(hours.toFixed(
            1
          )),
      })
    );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard Ejecutivo
        </h1>

        <p className="text-gray-500 mt-2">
          Resumen general del sistema
        </p>
      </div>

      {/* KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
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
            Actividades
          </p>

          <h2 className="text-4xl font-bold text-gray-800 mt-3">
            {entries.length}
          </h2>
        </div>

        {/* USERS */}
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">
            Colaboradores
          </p>

          <h2 className="text-4xl font-bold text-gray-800 mt-3">
            {users}
          </h2>
        </div>

        {/* CLIENTS */}
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">
            Clientes activos
          </p>

          <h2 className="text-4xl font-bold text-gray-800 mt-3">
            {clients}
          </h2>
        </div>
      </div>

      {/* CHARTS */}
      <DashboardCharts
        userData={userData}
        clientData={
          clientData
        }
      />

      {/* RECENT */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Últimas actividades
          </h2>
        </div>

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
                  Tiempo
                </th>
              </tr>
            </thead>

            <tbody>
              {entries
                .slice(0, 10)
                .map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-t"
                  >
                    <td className="px-6 py-4">
                      {
                        entry.user
                          .name
                      }
                    </td>

                    <td className="px-6 py-4">
                      {
                        entry.client
                          .name
                      }
                    </td>

                    <td className="px-6 py-4">
                      {
                        entry.description
                      }
                    </td>

                    <td className="px-6 py-4">
                      {
                        entry.duration
                      }{" "}
                      min
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}