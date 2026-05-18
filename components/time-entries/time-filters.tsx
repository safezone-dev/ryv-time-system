"use client";

import { useState } from "react";

export default function TimeFilters({
  users,
  clients,
  selectedUser,
  selectedClient,
}: any) {
  const [search, setSearch] =
    useState(
      clients.find(
        (c: any) =>
          c.id === selectedClient
      )?.name || ""
    );

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <form className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* USER */}
        <select
          name="user"
          defaultValue={
            selectedUser
          }
          className="border border-gray-300 rounded-xl px-4 py-3"
        >
          <option value="">
            Todos los usuarios
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
            placeholder="Buscar empresa..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />

          <input
            type="hidden"
            name="client"
            value={
              selectedClient
            }
            id="clientHidden"
          />

          {/* RESULTS */}
          {search && (
            <div className="absolute z-20 bg-white border border-gray-200 rounded-xl mt-2 w-full max-h-60 overflow-y-auto shadow-lg">
              {clients
                .filter(
                  (client: any) =>
                    client.name
                      .toLowerCase()
                      .includes(
                        search.toLowerCase()
                      )
                )
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
                        setSearch(
                          client.name
                        );

                        const hidden =
                          document.getElementById(
                            "clientHidden"
                          ) as HTMLInputElement;

                        hidden.value =
                          client.id;
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b"
                    >
                      {
                        client.name
                      }
                    </button>
                  )
                )}
            </div>
          )}
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6 py-3 font-semibold"
        >
          Filtrar
        </button>
      </form>
    </div>
  );
}