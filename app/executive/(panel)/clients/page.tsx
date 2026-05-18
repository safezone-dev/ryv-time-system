import { prisma } from "@/lib/prisma";

import {
  getServerSession,
} from "next-auth";

import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

import ClientDetailsModal from "@/components/executive/client-details-modal";

export default async function ExecutiveClientsPage() {
  // SESSION
  const session =
    await getServerSession(
      authOptions
    );

  // NO SESSION
  if (!session) {
    redirect(
      "/executive/login"
    );
  }

  // VALIDAR ROLE
  if (
    session.user.role !==
      "EXECUTIVE" &&
    session.user.role !==
      "COLLABORATOR"
  ) {
    redirect("/login");
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
  // KPIS
  // =========================

  const activeClients =
    clients.filter(
      (c) => c.active
    );

  const contacts =
    clients.filter(
      (c) => c.contact
    );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Mis clientes
        </h1>

        <p className="text-gray-500 mt-2">
          Gestión y visualización de clientes asignados
        </p>
      </div>

      {/* KPI BAR */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {/* TOTAL */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Clientes
          </p>

          <h2 className="text-2xl font-bold text-blue-700 mt-2">
            {clients.length}
          </h2>
        </div>

        {/* ACTIVE */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Activos
          </p>

          <h2 className="text-2xl font-bold text-green-600 mt-2">
            {
              activeClients.length
            }
          </h2>
        </div>

        {/* CONTACTS */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Contactos
          </p>

          <h2 className="text-2xl font-bold text-blue-700 mt-2">
            {
              contacts.length
            }
          </h2>
        </div>

        {/* EXECUTIVES */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Ejecutivo
          </p>

          <h2 className="text-2xl font-bold text-blue-700 mt-2">
            1
          </h2>
        </div>
      </div>

      {/* CLIENT TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Clientes asignados
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Clientes relacionados a su cuenta ejecutiva
            </p>
          </div>

          <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold">
            {clients.length} clientes
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden">
          <table className="w-full text-xs md:text-sm">
            <thead className="bg-gray-50">
              <tr>
                {/* CLIENT */}
                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Cliente
                </th>

                {/* CONTACT */}
                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Contacto
                </th>

                {/* STATUS */}
                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Estado
                </th>

                {/* ACTION */}
                <th className="text-center px-6 py-4 font-semibold text-gray-600 w-[100px]">
                  Ver
                </th>
              </tr>
            </thead>

            <tbody>
              {clients.map(
                (client) => (
                  <tr
                    key={
                      client.id
                    }
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    {/* CLIENT */}
                    <td className="px-6 py-4 font-medium break-words text-gray-800">
                      {
                        client.name
                      }
                    </td>

                    {/* CONTACT */}
                    <td className="px-6 py-4 break-words text-gray-600">
                      {client.contact ||
                        "-"}
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      {client.active ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-semibold">
                          ACTIVO
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-semibold">
                          INACTIVO
                        </span>
                      )}
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <ClientDetailsModal
                          client={
                            client
                          }
                        />
                      </div>
                    </td>
                  </tr>
                )
              )}

              {clients.length ===
                0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-10 text-gray-500"
                  >
                    No tienes clientes asignados
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