import { prisma } from "@/lib/prisma";

import {
  getServerSession,
} from "next-auth";

import { authOptions } from "@/lib/auth";

import TimeTracker from "@/components/time-entries/time-tracker";

import {
  createTimeEntry,
} from "@/actions/time-entry-actions";

export default async function TimeEntriesPage() {
  // SESSION
  const session =
    await getServerSession(
      authOptions
    );

  const role =
    session?.user?.role;

  const userId =
    session?.user?.id;

  // =========================
  // CLIENTES
  // =========================

  let clients = [];

  // ADMIN VE TODOS
  if (role === "ADMIN") {
    clients =
      await prisma.client.findMany({
        where: {
          active: true,
        },

        orderBy: {
          name: "asc",
        },
      });
  }

  // EXECUTIVE / COLLABORATOR
  else {
    const assignments =
      await prisma.assignment.findMany(
        {
          where: {
            userId,
          },

          include: {
            client: true,
          },
        }
      );

    clients =
      assignments.map(
        (a) => a.client
      );
  }

  // =========================
  // ACTIVIDADES
  // =========================

  let entries = [];

  // ADMIN VE TODO
  if (role === "ADMIN") {
    entries =
      await prisma.timeEntry.findMany(
        {
          include: {
            user: true,
            client: true,
          },

          orderBy: {
            createdAt:
              "desc",
          },
        }
      );
  }

  // EXECUTIVE/COLLAB SOLO SUYO
  else {
    entries =
      await prisma.timeEntry.findMany(
        {
          where: {
            userId,
          },

          include: {
            user: true,
            client: true,
          },

          orderBy: {
            createdAt:
              "desc",
          },
        }
      );
  }

  // =========================
  // MÉTRICAS
  // =========================

  const totalMinutes =
    entries.reduce(
      (acc, entry) =>
        acc +
        (entry.duration || 0),
      0
    );

  const totalHours = (
    totalMinutes / 60
  ).toFixed(1);

  // =========================
  // UI
  // =========================

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Control de tiempos
        </h1>

        <p className="text-gray-500 mt-2">
          Registro y control de actividades
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* HOURS */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Horas registradas
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-3">
            {totalHours}h
          </h2>
        </div>

        {/* ACTIVITIES */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Actividades
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-3">
            {entries.length}
          </h2>
        </div>

        {/* CLIENTS */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Clientes asignados
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-3">
            {clients.length}
          </h2>
        </div>
      </div>

      {/* TRACKER SOLO EXECUTIVE/COLLAB */}
      {role !== "ADMIN" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <TimeTracker
            clients={clients}
            entries={entries}
            createTimeEntry={
              createTimeEntry
            }
            isAdmin={false}
          />
        </div>
      )}

      {/* ADMIN INFO */}
      {role === "ADMIN" && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-blue-800">
            Vista Administrativa
          </h2>

          <p className="text-blue-700 mt-2">
            Los administradores no registran actividades.
            Esta sección es únicamente para monitoreo y análisis del sistema.
          </p>
        </div>
      )}
    </div>
  );
}