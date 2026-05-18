import { prisma } from "@/lib/prisma";

import {
  getServerSession,
} from "next-auth";

import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

import {
  createExecutiveActivity,
  closeExecutiveActivity,
} from "@/actions/executive-time-entry-actions";

export default async function ExecutiveTimeEntriesPage() {
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
  // CLIENTES
  // =========================

  const assignments =
    await prisma.assignment.findMany(
      {
        where: {
          userId,
        },

        include: {
          client: true,
        },

        orderBy: {
          client: {
            name: "asc",
          },
        },
      }
    );

  const clients =
    assignments.map(
      (a) => a.client
    );

  // =========================
  // ACTIVIDADES
  // =========================

  const entries =
    await prisma.timeEntry.findMany(
      {
        where: {
          userId,
        },

        include: {
          client: true,
        },

        orderBy: {
          createdAt:
            "desc",
        },
      }
    );

  // =========================
  // ACTIVAS
  // =========================

  const activeEntries =
    entries.filter(
      (e) =>
        e.status ===
        "ACTIVE"
    );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Actividades
        </h1>

        <p className="text-gray-500 mt-2">
          Gestión de actividades ejecutivas
        </p>
      </div>

      {/* NUEVA ACTIVIDAD */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-5">
          Nueva actividad
        </h2>

        <form
          action={
            createExecutiveActivity
          }
          className="grid grid-cols-1 lg:grid-cols-4 gap-4"
        >
          {/* USER */}
          <input
            type="hidden"
            name="userId"
            value={userId}
          />

          {/* CLIENTE */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente
            </label>

            <select
              name="clientId"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm"
            >
              <option value="">
                Seleccionar
              </option>

              {clients.map(
                (client) => (
                  <option
                    key={
                      client.id
                    }
                    value={
                      client.id
                    }
                  >
                    {
                      client.name
                    }
                  </option>
                )
              )}
            </select>
          </div>

          {/* ACTIVIDAD */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actividad
            </label>

            <input
              type="text"
              name="description"
              required
              placeholder="Descripción de la actividad"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm"
            />
          </div>

          {/* BOTON */}
          <div className="flex items-end">
            <button
              type="submit"
              className="
                w-full
                bg-blue-700
                hover:bg-blue-800
                text-white
                rounded-xl
                px-4
                py-3
                text-sm
                font-semibold
                transition
              "
            >
              Iniciar actividad
            </button>
          </div>
        </form>
      </div>

      {/* ACTIVIDADES ACTIVAS */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Actividades activas
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Actividades en proceso
            </p>
          </div>

          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold">
            {
              activeEntries.length
            }{" "}
            activas
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Cliente
                </th>

                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Actividad
                </th>

                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Inicio
                </th>

                <th className="text-center px-6 py-4 font-semibold text-gray-600">
                  Acción
                </th>
              </tr>
            </thead>

            <tbody>
              {activeEntries.map(
                (entry) => (
                  <tr
                    key={entry.id}
                    className="border-t border-gray-100"
                  >
                    {/* CLIENT */}
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {
                        entry.client
                          .name
                      }
                    </td>

                    {/* DESCRIPTION */}
                    <td className="px-6 py-4 text-gray-600">
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

                    {/* CLOSE */}
                    <td className="px-6 py-4">
                      <form
                        action={
                          closeExecutiveActivity
                        }
                        className="flex flex-col gap-2"
                      >
                        <input
                          type="hidden"
                          name="entryId"
                          value={
                            entry.id
                          }
                        />

                        <textarea
                          name="closingNotes"
                          placeholder="Observaciones finales"
                          required
                          className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs"
                        />

                        <button
                          type="submit"
                          className="
                            bg-red-600
                            hover:bg-red-700
                            text-white
                            rounded-xl
                            px-4
                            py-2
                            text-xs
                            font-semibold
                            transition
                          "
                        >
                          Cerrar actividad
                        </button>
                      </form>
                    </td>
                  </tr>
                )
              )}

              {activeEntries.length ===
                0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-10 text-gray-500"
                  >
                    No existen actividades activas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INFO */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-blue-800">
          Historial de actividades
        </h2>

        <p className="text-sm text-blue-700 mt-2">
          El historial completo de actividades cerradas ahora se encuentra en el módulo:
        </p>

        <div className="mt-4">
          <a
            href="/executive/history"
            className="
              inline-flex
              items-center
              gap-2
              bg-blue-700
              hover:bg-blue-800
              text-white
              px-5
              py-3
              rounded-xl
              text-sm
              font-semibold
              transition
            "
          >
            Ir al historial
          </a>
        </div>
      </div>
    </div>
  );
}