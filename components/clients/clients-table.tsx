"use client";

import { useMemo, useState } from "react";

export default function ClientsTable({
  clients,
  updateClient,
  deleteClient,
  importClients,
}: any) {
  const [editingClient, setEditingClient] =
    useState<any>(null);

  const [openImport, setOpenImport] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [importing, setImporting] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [importResult, setImportResult] =
    useState<any>(null);

  const ITEMS_PER_PAGE = 10;

  // EJECUTIVOS DINAMICOS
  const executives = useMemo(() => {
    return [
      ...new Set(
        clients
          .map(
            (c: any) =>
              c.executive
          )
          .filter(Boolean)
      ),
    ];
  }, [clients]);

  // ASESORES DINAMICOS
  const advisors = useMemo(() => {
    return [
      ...new Set(
        clients
          .map(
            (c: any) =>
              c.advisor
          )
          .filter(Boolean)
      ),
    ];
  }, [clients]);

  // FILTRO
  const filteredClients = useMemo(() => {
    return clients.filter((client: any) =>
      client.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [clients, search]);

  // PAGINACIÓN
  const totalPages = Math.ceil(
    filteredClients.length /
      ITEMS_PER_PAGE
  );

  const paginatedClients =
    filteredClients.slice(
      (currentPage - 1) *
        ITEMS_PER_PAGE,

      currentPage * ITEMS_PER_PAGE
    );

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Clientes
          </h1>

          <p className="text-gray-500 mt-1">
            Gestión de clientes
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Buscar empresa..."
            value={search}
            onChange={(e) => {
              setSearch(
                e.target.value
              );

              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-xl px-4 py-3 w-full lg:w-80"
          />

          {/* IMPORT BUTTON */}
          <button
            type="button"
            onClick={() =>
              setOpenImport(true)
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold whitespace-nowrap"
          >
            Importar Excel
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full table-fixed">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-4">
                Cliente
              </th>

              <th className="text-left px-4 py-4 hidden lg:table-cell">
                Contacto
              </th>

              <th className="text-left px-4 py-4 hidden xl:table-cell">
                Teléfono
              </th>

              <th className="text-left px-4 py-4 hidden 2xl:table-cell">
                Correo
              </th>

              <th className="text-left px-4 py-4">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedClients.map(
              (client: any) => (
                <tr
                  key={client.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-800">
                      {client.name}
                    </div>

                    {/* MOBILE */}
                    <div className="lg:hidden mt-2 text-sm text-gray-500">
                      <p>
                        {
                          client.contact
                        }
                      </p>

                      <p>
                        {
                          client.phone
                        }
                      </p>

                      <p>
                        {
                          client.email
                        }
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-4 hidden lg:table-cell">
                    {client.contact ||
                      "-"}
                  </td>

                  <td className="px-4 py-4 hidden xl:table-cell">
                    {client.phone ||
                      "-"}
                  </td>

                  <td className="px-4 py-4 hidden 2xl:table-cell">
                    {client.email ||
                      "-"}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      {/* EDIT */}
                      <button
                        type="button"
                        onClick={() =>
                          setEditingClient(
                            client
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
                      >
                        Editar
                      </button>

                      {/* DELETE */}
                      <form
                        action={
                          deleteClient
                        }
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={client.id}
                        />

                        <button
                          type="submit"
                          onClick={(e) => {
                            const confirmDelete =
                              confirm(
                                "¿Desea eliminar este cliente?"
                              );

                            if (
                              !confirmDelete
                            ) {
                              e.preventDefault();
                            }
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
                        >
                          Borrar
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage(
              currentPage - 1
            )
          }
          className="border px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Anterior
        </button>

        <div className="text-sm text-gray-500">
          Página {currentPage} de{" "}
          {totalPages}
        </div>

        <button
          disabled={
            currentPage === totalPages
          }
          onClick={() =>
            setCurrentPage(
              currentPage + 1
            )
          }
          className="border px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

      {/* IMPORT MODAL */}
      {openImport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  Importar Clientes
                </h2>

                <p className="text-gray-500 mt-2">
                  Seleccione un archivo Excel o CSV
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setOpenImport(false);
                  setProgress(0);
                  setImporting(false);
                  setImportResult(
                    null
                  );
                }}
                className="text-2xl"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();

                try {
                  setImporting(true);

                  setProgress(20);

                  const form =
                    e.currentTarget;

                  const formData =
                    new FormData(form);

                  const interval =
                    setInterval(() => {
                      setProgress(
                        (
                          prev
                        ) => {
                          if (
                            prev >=
                            90
                          ) {
                            return prev;
                          }

                          return (
                            prev +
                            10
                          );
                        }
                      );
                    }, 400);

                  const result =
                    await importClients(
                      formData
                    );

                  clearInterval(
                    interval
                  );

                  setImportResult(
                    result
                  );

                  setProgress(100);

                  setTimeout(() => {
                    window.location.reload();
                  }, 1500);
                } catch (error) {
                  console.error(
                    error
                  );

                  alert(
                    "Error importando archivo"
                  );

                  setImporting(
                    false
                  );
                }
              }}
              className="space-y-6"
            >
              <input
                type="file"
                name="file"
                accept=".xlsx,.xls,.csv"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />

              {/* PROGRESS */}
              {importing && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>
                      Importando...
                    </span>

                    <span>
                      {progress}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-blue-600 h-4 rounded-full transition-all"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* RESULT */}
              {importResult && (
                <div className="bg-gray-50 border rounded-xl p-4 space-y-2">
                  <p>
                    <strong>
                      Total:
                    </strong>{" "}
                    {
                      importResult.totalRows
                    }
                  </p>

                  <p>
                    <strong>
                      Creados:
                    </strong>{" "}
                    {
                      importResult.createdRows
                    }
                  </p>

                  <p>
                    <strong>
                      Actualizados:
                    </strong>{" "}
                    {
                      importResult.updatedRows
                    }
                  </p>

                  <p>
                    <strong>
                      Omitidos:
                    </strong>{" "}
                    {
                      importResult.skippedRows
                    }
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={importing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold"
              >
                {importing
                  ? "Importando..."
                  : "Importar Archivo"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Editar Cliente
                </h2>

                <p className="text-gray-500 mt-1">
                  Actualice la información del cliente
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingClient(null)
                }
                className="text-2xl text-gray-500"
              >
                ✕
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                try {
                  const form =
                    e.currentTarget;

                  const formData =
                    new FormData(form);

                  await updateClient(
                    formData
                  );

                  setEditingClient(
                    null
                  );

                  window.location.reload();
                } catch (error) {
                  console.error(
                    error
                  );

                  alert(
                    "Error actualizando cliente"
                  );
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              <input
                type="hidden"
                name="id"
                value={editingClient.id}
              />

              {/* CLIENTE */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del Cliente
                </label>

                <input
                  type="text"
                  name="name"
                  defaultValue={
                    editingClient.name
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                  required
                />
              </div>

              {/* CONTACTO */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contacto
                </label>

                <input
                  type="text"
                  name="contact"
                  defaultValue={
                    editingClient.contact
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                />
              </div>

              {/* TELEFONO */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono
                </label>

                <input
                  type="text"
                  name="phone"
                  defaultValue={
                    editingClient.phone
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico
                </label>

                <input
                  type="email"
                  name="email"
                  defaultValue={
                    editingClient.email
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                />
              </div>

              {/* EJECUTIVO */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ejecutivo
                </label>

                <select
                  name="executive"
                  defaultValue={
                    editingClient.executive ||
                    ""
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white"
                >
                  <option value="">
                    Seleccione un ejecutivo
                  </option>

                  {executives.map(
                    (
                      executive: any
                    ) => (
                      <option
                        key={
                          executive
                        }
                        value={
                          executive
                        }
                      >
                        {
                          executive
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* ASESOR */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Asesor
                </label>

                <select
                  name="advisor"
                  defaultValue={
                    editingClient.advisor ||
                    ""
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white"
                >
                  <option value="">
                    Seleccione un asesor
                  </option>

                  {advisors.map(
                    (
                      advisor: any
                    ) => (
                      <option
                        key={advisor}
                        value={
                          advisor
                        }
                      >
                        {advisor}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* BUTTONS */}
              <div className="md:col-span-2 flex gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold"
                >
                  Guardar Cambios
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setEditingClient(
                      null
                    )
                  }
                  className="border border-gray-300 hover:bg-gray-100 py-3 px-6 rounded-xl font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}