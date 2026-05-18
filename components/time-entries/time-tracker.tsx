"use client";

import {
  useMemo,
  useState,
} from "react";

export default function TimeTracker({
  clients,
  createTimeEntry,
}: any) {
  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [selectedClient, setSelectedClient] =
    useState("");

  // FILTER CLIENTS
  const filteredClients =
    useMemo(() => {
      return clients.filter(
        (client: any) =>
          client.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [clients, search]);

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Registrar actividad
      </h2>

      <form
        action={async (
          formData: FormData
        ) => {
          setLoading(true);

          formData.set(
            "clientId",
            selectedClient
          );

          await createTimeEntry(
            formData
          );

          window.location.reload();
        }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-5"
      >
        {/* CLIENT SEARCH */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold mb-2">
            Buscar empresa
          </label>

          <input
            type="text"
            placeholder="Escriba el nombre de la empresa..."
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
            <div className="mt-2 border border-gray-200 rounded-xl max-h-60 overflow-y-auto bg-white shadow">
              {filteredClients.length >
              0 ? (
                filteredClients.map(
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
                      {client.name}
                    </button>
                  )
                )
              ) : (
                <div className="p-4 text-gray-500">
                  No se encontraron empresas
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

        {/* DATE */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Fecha
          </label>

          <input
            type="date"
            name="date"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />
        </div>

        {/* START */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Hora entrada
          </label>

          <input
            type="time"
            name="startTime"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />
        </div>

        {/* END */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Hora salida
          </label>

          <input
            type="time"
            name="endTime"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold mb-2">
            Descripción actividad
          </label>

          <textarea
            name="description"
            rows={4}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />
        </div>

        {/* BUTTON */}
        <div className="lg:col-span-2">
          <button
            type="submit"
            disabled={
              loading ||
              !selectedClient
            }
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl px-6 py-3 font-semibold"
          >
            {loading
              ? "Guardando..."
              : "Registrar actividad"}
          </button>
        </div>
      </form>
    </div>
  );
}