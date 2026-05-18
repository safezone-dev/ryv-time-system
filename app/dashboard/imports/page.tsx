import { prisma } from "@/lib/prisma";

import { requireAdmin } from "@/lib/role-guard";

import { importClients } from "@/actions/import-clients";

export default async function ImportsPage() {
  // SOLO ADMIN
  await requireAdmin();

  // IMPORTACIONES
  const imports =
    await prisma.importLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Importaciones
        </h1>

        <p className="text-gray-500 mt-2">
          Importación masiva de clientes y executives desde Excel
        </p>
      </div>

      {/* IMPORT FORM */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-5">
          Importar archivo Excel
        </h2>

        <form
          action={importClients}
          className="space-y-5"
        >
          {/* FILE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo Excel
            </label>

            <input
              type="file"
              name="file"
              required
              accept=".xlsx,.xls"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm"
            />
          </div>

          {/* INFO */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
            El sistema:
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>
                Importa clientes
              </li>

              <li>
                Actualiza clientes existentes
              </li>

              <li>
                Crea executives automáticamente
              </li>

              <li>
                Asigna clientes automáticamente
              </li>

              <li>
                Evita duplicados
              </li>
            </ul>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Importar Excel
          </button>
        </form>
      </div>

      {/* HISTORY */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Historial de importaciones
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Archivo
                </th>

                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Total
                </th>

                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Creados
                </th>

                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Actualizados
                </th>

                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Omitidos
                </th>

                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Fecha
                </th>
              </tr>
            </thead>

            <tbody>
              {imports.map(
                (item) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {
                        item.fileName
                      }
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {
                        item.totalRows
                      }
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-semibold">
                        {
                          item.createdRows
                        }
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-semibold">
                        {
                          item.updatedRows
                        }
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-xs font-semibold">
                        {
                          item.skippedRows
                        }
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(
                        item.createdAt
                      ).toLocaleString()}
                    </td>
                  </tr>
                )
              )}

              {imports.length ===
                0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-gray-500"
                  >
                    No existen importaciones registradas
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