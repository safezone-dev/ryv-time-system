import { prisma } from "@/lib/prisma";

import { requireExecutiveOrAdmin } from "@/lib/role-guard";

import ClientsTable from "@/components/clients/clients-table";

import {
  createClient,
  updateClient,
  deleteClient,
} from "@/actions/client-actions";

export default async function ClientsPage() {
  // PROTEGER ADMIN Y EXECUTIVE
  await requireExecutiveOrAdmin();

  // CLIENTS
  const clients =
    await prisma.client.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Clientes
        </h1>

        <p className="text-gray-500 mt-2">
          Gestión y administración de clientes del sistema
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <ClientsTable
          clients={clients}
          createClient={
            createClient
          }
          updateClient={
            updateClient
          }
          deleteClient={
            deleteClient
          }
        />
      </div>
    </div>
  );
}