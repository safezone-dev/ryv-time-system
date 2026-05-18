"use client";

import Link from "next/link";

import {
  LayoutDashboard,
  Users,
  Clock3,
  History,
  LogOut,
} from "lucide-react";

import {
  signOut,
} from "next-auth/react";

import { usePathname } from "next/navigation";

// =========================
// TYPES
// =========================

interface Props {
  userName: string;

  userEmail: string;
}

export default function ExecutiveSidebar({
  userName,

  userEmail,
}: Props) {
  const pathname =
    usePathname();

  // INITIAL
  const initial =
    userName.charAt(0);

  // MENU
  const menuItems = [
    {
      label:
        "Dashboard",

      href:
        "/executive/dashboard",

      icon:
        LayoutDashboard,
    },

    {
      label:
        "Clientes",

      href:
        "/executive/clients",

      icon:
        Users,
    },

    {
      label:
        "Actividades",

      href:
        "/executive/time-entries",

      icon:
        Clock3,
    },

    {
      label:
        "Historial",

      href:
        "/executive/history",

      icon:
        History,
    },
  ];

  return (
    <aside
      className="
        w-72
        bg-blue-700
        text-white
        flex
        flex-col
        h-screen
        sticky
        top-0
        shrink-0
      "
    >
      {/* HEADER */}
      <div className="px-6 py-8 border-b border-blue-600">
        <h1 className="text-2xl font-bold">
          RYV CRM
        </h1>

        <p className="text-blue-100 text-sm mt-2">
          Executive Panel
        </p>
      </div>

      {/* USER */}
      <div className="px-6 py-5 border-b border-blue-600">
        <div className="flex items-center gap-4">
          {/* AVATAR */}
          <div
            className="
              w-12
              h-12
              rounded-full
              bg-white
              text-blue-700
              flex
              items-center
              justify-center
              text-lg
              font-bold
            "
          >
            {initial}
          </div>

          {/* INFO */}
          <div className="min-w-0">
            <h3 className="font-semibold truncate">
              {userName}
            </h3>

            <p className="text-blue-100 text-xs truncate">
              {userEmail}
            </p>

            <p className="text-blue-200 text-xs mt-1">
              Executive
            </p>
          </div>
        </div>
      </div>

      {/* MENU */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map(
          (item) => {
            const Icon =
              item.icon;

            const active =
              pathname ===
              item.href;

            return (
              <Link
                key={
                  item.href
                }
                href={
                  item.href
                }
                className={`
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-2xl
                  transition
                  text-sm
                  font-medium
                  ${
                    active
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-white hover:bg-blue-600"
                  }
                `}
              >
                <Icon
                  size={20}
                />

                <span>
                  {
                    item.label
                  }
                </span>
              </Link>
            );
          }
        )}
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-blue-600">
        <button
          onClick={() =>
            signOut({
              callbackUrl:
                "/executive/login",
            })
          }
          className="
            w-full
            flex
            items-center
            justify-center
            gap-2
            bg-red-500
            hover:bg-red-600
            transition
            rounded-2xl
            py-3
            text-sm
            font-semibold
          "
        >
          <LogOut size={18} />

          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}