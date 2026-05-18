"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  createAssignment,
  deleteAssignment,
} from "@/actions/assignment-actions";

export default function AssignmentsPageClient({
  users,
  clients,
  assignments,
}: any) {
  const [search, setSearch] =
    useState("");

  const [selectedClient, setSelectedClient] =
    useState("");

  const filteredClients =
    useMemo(() => {
      return (
        clients || []
      ).filter(
        (client: any) =>
          client.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [clients, search]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Asignaciones
        </h1>

        <p className="text-gray-500 mt-2">
          Gestión de clientes asignados a usuarios
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow p-6">
        <form
          action={async (
            formData: FormData
          ) => {
            formData.set(
              "clientId",
              selectedClient
            );

            await createAssignment(
              formData
            );

            window.location.reload();
          }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {/* USER */}
          <select
            name="userId"
            required
            className="border border-gray-300 rounded-xl px-4 py-3"
          >
            <option value="">
              Seleccione usuario
            </option>

            {users.map((user: any) => (
              <option
                key={user.id}
                value={user.id}
              >
                {user.name}
              </option>
            ))}
          </select>

          {/* CLIENT SEARCH */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />

            {/* RESULTS */}
            {search && (
              <div className="absolute z-20 bg-white border border-gray-200 rounded-xl mt-2 w-full max-h-60 overflow-y-auto shadow-lg">
                {filteredClients.length >
                0 ? (
                  filteredClients
                    .slice(0, 20)
                    .map(
                      (
                        client: any
                      ) => (
                        <button
                          type="button"
                          key={
                            client.id
                          }
                          onClick={() => {
                            setSelectedClient(
                              client.id
                            );

                            setSearch(
                              client.name
                            );
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-100 border-b ${
                            selectedClient ===
                            client.id
                              ? "bg-green-50"
                              : ""
                          }`}
                        >
                          {
                            client.name
                          }
                        </button>
                      )
                    )
                ) : (
                  <div className="p-4 text-gray-500">
                    No se encontraron clientes
                  </div>
                )}
              </div>
            )}

            {/* HIDDEN */}
            <input
              type="hidden"
              name="clientId"
              value={
                selectedClient
              }
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={
              !selectedClient
            }
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl px-6 py-3 font-semibold"
          >
            Crear asignación
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Asignaciones actuales
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
                  Rol
                </th>

                <th className="text-left px-6 py-4">
                  Acción
                </th>
              </tr>
            </thead>

            <tbody>
              {assignments.map(
                (
                  assignment: any
                ) => (
                  <tr
                    key={
                      assignment.id
                    }
                    className="border-t"
                  >
                    <td className="px-6 py-4">
                      {
                        assignment
                          .user
                          .name
                      }
                    </td>

                    <td className="px-6 py-4">
                      {
                        assignment
                          .client
                          .name
                      }
                    </td>

                    <td className="px-6 py-4">
                      <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm">
                        {
                          assignment
                            .user
                            .role
                        }
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <form
                        action={async () => {
                          await deleteAssignment(
                            assignment.id
                          );

                          window.location.reload();
                        }}
                      >
                        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">
                          Eliminar
                        </button>
                      </form>
                    </td>
                  </tr>
                )
              )}

              {assignments.length ===
                0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center p-10 text-gray-500"
                  >
                    No existen asignaciones
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