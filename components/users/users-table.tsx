"use client";

import { useMemo, useState } from "react";

export default function UsersTable({
  users,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
}: any) {
  const [search, setSearch] =
    useState("");

  const [openCreate, setOpenCreate] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState<any>(null);

  const [resetUser, setResetUser] =
    useState<any>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((user: any) => {
      return (
        user.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        user.email
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );
    });
  }, [users, search]);

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Usuarios
          </h1>

          <p className="text-gray-500 mt-1">
            Gestión de usuarios
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="border border-gray-300 rounded-xl px-4 py-3 w-full lg:w-80"
          />

          {/* CREATE */}
          <button
            type="button"
            onClick={() =>
              setOpenCreate(true)
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
          >
            Registrar Usuario
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-4">
                Nombre
              </th>

              <th className="text-left px-4 py-4">
                Correo
              </th>

              <th className="text-left px-4 py-4">
                Rol
              </th>

              <th className="text-left px-4 py-4">
                Estado
              </th>

              <th className="text-left px-4 py-4">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map(
              (user: any) => (
                <tr
                  key={user.id}
                  className="border-t"
                >
                  <td className="px-4 py-4">
                    {user.name}
                  </td>

                  <td className="px-4 py-4">
                    {user.email}
                  </td>

                  <td className="px-4 py-4">
                    {user.role}
                  </td>

                  <td className="px-4 py-4">
                    {user.active
                      ? "Activo"
                      : "Inactivo"}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex gap-2 flex-wrap">
                      {/* EDIT */}
                      <button
                        type="button"
                        onClick={() =>
                          setEditingUser(
                            user
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
                      >
                        Editar
                      </button>

                      {/* PASSWORD */}
                      <button
                        type="button"
                        onClick={() =>
                          setResetUser(
                            user
                          )
                        }
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm"
                      >
                        Password
                      </button>

                      {/* DELETE */}
                      <form
                        action={
                          deleteUser
                        }
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={user.id}
                        />

                        <button
                          type="submit"
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

      {/* CREATE MODAL */}
      {openCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Registrar Usuario
              </h2>

              <button
                type="button"
                onClick={() =>
                  setOpenCreate(false)
                }
                className="text-2xl"
              >
                ✕
              </button>
            </div>

            <form
              action={async (
                formData: FormData
              ) => {
                await createUser(
                  formData
                );

                window.location.reload();
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Nombre
                </label>

                <input
                  type="text"
                  name="name"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Correo
                </label>

                <input
                  type="email"
                  name="email"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Contraseña
                </label>

                <input
                  type="password"
                  name="password"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Rol
                </label>

                <select
                  name="role"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white"
                >
                  <option value="ADMIN">
                    ADMIN
                  </option>

                  <option value="COLLABORATOR">
                    COLLABORATOR
                  </option>

                  <option value="EXECUTIVE">
                    EXECUTIVE
                  </option>
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold"
                >
                  Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Editar Usuario
              </h2>

              <button
                type="button"
                onClick={() =>
                  setEditingUser(null)
                }
                className="text-2xl"
              >
                ✕
              </button>
            </div>

            <form
              action={async (
                formData: FormData
              ) => {
                await updateUser(
                  formData
                );

                window.location.reload();
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              <input
                type="hidden"
                name="id"
                value={
                  editingUser.id
                }
              />

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Nombre
                </label>

                <input
                  type="text"
                  name="name"
                  defaultValue={
                    editingUser.name
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Correo
                </label>

                <input
                  type="email"
                  name="email"
                  defaultValue={
                    editingUser.email
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Rol
                </label>

                <select
                  name="role"
                  defaultValue={
                    editingUser.role
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white"
                >
                  <option value="ADMIN">
                    ADMIN
                  </option>

                  <option value="COLLABORATOR">
                    COLLABORATOR
                  </option>

                  <option value="EXECUTIVE">
                    EXECUTIVE
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Estado
                </label>

                <select
                  name="active"
                  defaultValue={
                    editingUser.active
                      ? "true"
                      : "false"
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white"
                >
                  <option value="true">
                    Activo
                  </option>

                  <option value="false">
                    Inactivo
                  </option>
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PASSWORD MODAL */}
      {resetUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Reset Password
              </h2>

              <button
                type="button"
                onClick={() =>
                  setResetUser(null)
                }
                className="text-2xl"
              >
                ✕
              </button>
            </div>

            <form
              action={async (
                formData: FormData
              ) => {
                formData.append(
                  "id",
                  resetUser.id
                );

                await resetUserPassword(
                  formData
                );

                window.location.reload();
              }}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Nueva Contraseña
                </label>

                <input
                  type="password"
                  name="password"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-semibold"
              >
                Actualizar Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}