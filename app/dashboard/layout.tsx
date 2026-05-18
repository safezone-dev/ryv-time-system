"use client";

import Link from "next/link";

import {
  LayoutDashboard,
  Users,
  Building2,
  FileSpreadsheet,
  Clock3,
  Menu,
  X,
  LogOut,
  UserCircle2,
  BriefcaseBusiness,
} from "lucide-react";

import { useState } from "react";

import {
  signOut,
  useSession,
} from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] =
    useState(false);

  const { data: session } =
    useSession();

  const menu = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },

    {
      name: "Clientes",
      href: "/dashboard/clients",
      icon: Building2,
    },

    ...(session?.user?.role ===
    "ADMIN"
      ? [
          {
            name: "Usuarios",
            href:
              "/dashboard/users",
            icon: Users,
          },

          {
            name:
              "Asignaciones",
            href:
              "/dashboard/assignments",
            icon:
              BriefcaseBusiness,
          },
        ]
      : []),

    {
      name: "Importaciones",
      href: "/dashboard/imports",
      icon: FileSpreadsheet,
    },

    {
      name: "Tiempos",
      href:
        "/dashboard/time-entries",
      icon: Clock3,
    },
  ];

  async function handleLogout() {
    await signOut({
      callbackUrl: "/login",
    });
  }

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* OVERLAY MOBILE */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() =>
            setOpen(false)
          }
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:relative z-50 top-0 left-0 h-screen w-72 bg-green-700 text-white transform transition-transform duration-300 flex flex-col ${
          open
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-green-600">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              RYV CRM
            </h1>

            <p className="text-xs opacity-80 mt-1">
              Sistema de control de tiempos
            </p>
          </div>

          <button
            className="lg:hidden"
            onClick={() =>
              setOpen(false)
            }
          >
            <X size={22} />
          </button>
        </div>

        {/* USER */}
        <div className="px-5 py-4 border-b border-green-600">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2 shrink-0">
              <UserCircle2
                size={34}
              />
            </div>

            <div className="overflow-hidden min-w-0">
              <p className="font-semibold text-sm truncate">
                {session?.user
                  ?.name ||
                  "Usuario"}
              </p>

              <p className="text-xs opacity-80 truncate">
                {session?.user
                  ?.email || ""}
              </p>

              <p className="text-[10px] mt-1 bg-white/20 inline-block px-2 py-1 rounded-lg">
                {session?.user
                  ?.role || ""}
              </p>
            </div>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menu.map((item) => {
            const Icon =
              item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-600 transition text-sm font-medium"
              >
                <Icon size={18} />

                <span>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-green-600">
          <button
            onClick={
              handleLogout
            }
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition text-sm font-medium"
          >
            <LogOut size={18} />

            <span>
              Salir del sistema
            </span>
          </button>
        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 border-t border-green-600 text-xs">
          <p className="opacity-90 leading-relaxed">
            Desarrollado por{" "}
            <a
              href="mailto:wiledwardmunoz@gmail.com"
              className="underline font-semibold"
            >
              wiledwardmunoz
            </a>
          </p>
        </div>
      </aside>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* TOPBAR */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between flex-shrink-0">
          {/* LEFT */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="lg:hidden"
              onClick={() =>
                setOpen(true)
              }
            >
              <Menu size={24} />
            </button>

            <div className="min-w-0">
              <h2 className="text-lg lg:text-xl font-bold text-gray-800 truncate">
                Dashboard
              </h2>

              <p className="text-xs text-gray-500 hidden sm:block truncate">
                Sistema empresarial de gestión
              </p>
            </div>
          </div>

          {/* USER INFO */}
          <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-xl max-w-[240px] lg:max-w-[320px] min-w-0 shrink-0">
            <UserCircle2
              size={30}
              className="text-green-700 shrink-0"
            />

            <div className="overflow-hidden hidden sm:block min-w-0">
              <p className="font-semibold text-sm truncate text-gray-800">
                {session?.user
                  ?.name ||
                  "Usuario"}
              </p>

              <p className="text-xs text-gray-500 truncate">
                {session?.user
                  ?.email || ""}
              </p>

              <p className="text-[11px] text-green-700 font-semibold truncate">
                {session?.user
                  ?.role || ""}
              </p>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 lg:p-6">
          <div className="max-w-[1600px] mx-auto text-sm text-gray-700">
            {children}
          </div>
        </main>

        {/* MOBILE FOOTER */}
        <footer className="bg-white border-t px-4 py-3 text-center text-xs text-gray-500 lg:hidden flex-shrink-0">
          Desarrollado por{" "}
          <a
            href="mailto:wiledwardmunoz@gmail.com"
            className="font-semibold text-green-700"
          >
            wiledwardmunoz
          </a>
        </footer>
      </div>
    </div>
  );
}