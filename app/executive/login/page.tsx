"use client";

import { signIn } from "next-auth/react";

import { useRouter } from "next/navigation";

import { useState } from "react";

export default function ExecutiveLoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    setError("");

    try {
      const result =
        await signIn(
          "credentials",
          {
            email,
            password,

            redirect: false,
          }
        );

      // ERROR
      if (result?.error) {
        setError(
          "Correo o contraseña incorrectos"
        );

        setLoading(false);

        return;
      }

      // VALIDAR SESSION
      const sessionRes =
        await fetch(
          "/api/auth/session"
        );

      const session =
        await sessionRes.json();

      // SOLO EXECUTIVE/COLLAB
      if (
        session?.user
          ?.role !==
          "EXECUTIVE" &&
        session?.user
          ?.role !==
          "COLLABORATOR"
      ) {
        setError(
          "Acceso no autorizado"
        );

        setLoading(false);

        return;
      }

      // REDIRECT
      router.push(
        "/executive/dashboard"
      );

      router.refresh();
    } catch (error) {
      setError(
        "Error iniciando sesión"
      );

      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-700 items-center justify-center">
        <div className="text-white text-center px-10">
          <h1 className="text-5xl font-bold mb-6">
            RYV Executive
          </h1>

          <p className="text-xl opacity-90">
            Portal ejecutivo de productividad
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-1 items-center justify-center bg-gray-100 px-6">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Acceso Ejecutivo
            </h2>

            <p className="text-gray-500 mt-2">
              Ingrese sus credenciales
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={
              handleLogin
            }
            className="space-y-5"
          >
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Correo electrónico
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Contraseña
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 transition text-white py-3 rounded-xl font-semibold"
            >
              {loading
                ? "Ingresando..."
                : "Ingresar al portal"}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-8 text-center text-sm text-gray-500">
            Plataforma ejecutiva RYV
          </div>
        </div>
      </div>
    </div>
  );
}