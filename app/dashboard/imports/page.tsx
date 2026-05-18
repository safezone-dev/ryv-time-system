import { prisma } from "@/lib/prisma";

import { requireAdmin } from "@/lib/role-guard";

export default async function ImportsPage() {
  // PROTEGER SOLO ADMIN
  await requireAdmin();

  // IMPORT LOGS
  const imports =
    await prisma.importLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Importaciones
        </h1>

        <p className="text-gray-500 mt-2">
          Historial de importaciones realizadas en el sistema
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-6 py-4">
                  Archivo
                </th>

                <th className="text-left px-6 py-4">
                  Total filas
                </th>

                <th className="text-left px-6 py-4">
                  Creados
                </th>

                <th className="text-left px-6 py-4">
                  Actualizados
                </th>

                <th className="text-left px-6 py-4">
                  Omitidos
                </th>

                <th className="text-left px-6 py-4">
                  Fecha
                </th>
              </tr>
            </thead>

            <tbody>
              {imports.map(
                (item) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-gray-50"
                  >
                    {/* FILE */}
                    <td className="px-6 py-4 font-medium">
                      {
                        item.fileName
                      }
                    </td>

                    {/* TOTAL */}
                    <td className="px-6 py-4">
                      {
                        item.totalRows
                      }
                    </td>

                    {/* CREATED */}
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm">
                        {
                          item.createdRows
                        }
                      </span>
                    </td>

                    {/* UPDATED */}
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm">
                        {
                          item.updatedRows
                        }
                      </span>
                    </td>

                    {/* SKIPPED */}
                    <td className="px-6 py-4">
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-sm">
                        {
                          item.skippedRows
                        }
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    className="text-center p-10 text-gray-500"
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