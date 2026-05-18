"use client";

import {
  X,
  Eye,
} from "lucide-react";

import { useState } from "react";

export default function ClientDetailsModal({
  client,
}: any) {
  const [open, setOpen] =
    useState(false);

  return (
    <>
      {/* BUTTON */}
      <button
        onClick={() =>
          setOpen(true)
        }
        className="
          p-2
          rounded-lg
          bg-blue-100
          hover:bg-blue-200
          text-blue-700
          transition
        "
      >
        <Eye size={18} />
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Información cliente
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Detalle completo
                </p>
              </div>

              <button
                onClick={() =>
                  setOpen(false)
                }
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-6 space-y-5">
              {/* CLIENT */}
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Cliente
                </p>

                <p className="font-semibold text-gray-800 mt-1 break-words">
                  {client.name}
                </p>
              </div>

              {/* CONTACT */}
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Contacto
                </p>

                <p className="font-medium text-gray-700 mt-1 break-words">
                  {client.contact ||
                    "-"}
                </p>
              </div>

              {/* PHONE */}
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Teléfono
                </p>

                <p className="font-medium text-gray-700 mt-1 break-words">
                  {client.phone ||
                    "-"}
                </p>
              </div>

              {/* EMAIL */}
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Correo
                </p>

                <p className="font-medium text-gray-700 mt-1 break-words">
                  {client.email ||
                    "-"}
                </p>
              </div>

              {/* ADVISOR */}
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Asesor
                </p>

                <p className="font-medium text-gray-700 mt-1 break-words">
                  {client.advisor ||
                    "-"}
                </p>
              </div>

              {/* EXECUTIVE */}
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Ejecutivo
                </p>

                <p className="font-medium text-gray-700 mt-1 break-words">
                  {client.executive ||
                    "-"}
                </p>
              </div>
            </div>

            {/* FOOTER */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() =>
                  setOpen(false)
                }
                className="
                  px-5
                  py-2
                  rounded-xl
                  bg-blue-700
                  hover:bg-blue-800
                  text-white
                  text-sm
                  font-medium
                "
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}