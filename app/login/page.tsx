"use client";

import { signIn } from "next-auth/react";

import { useState } from "react";

import { useRouter } from "next/navigation";

export default function LoginPage() {
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

      // ERROR LOGIN
      if (result?.error) {
        setError(
          "Correo o contraseña incorrectos"
        );

        setLoading(false);

        return;
      }

      // SUCCESS
      router.push(
        "/dashboard"
      );

      router.refresh();
    } catch (err) {
      setError(
        "Error iniciando sesión"
      );

      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT */}
      <div className="hidden lg:flex lg:w-1/2 bg-green-600 items-center justify-center">
        <div className="text-white text-center px-10">
          <h1 className="text-5xl font-bold mb-6">
            RYV CRM
          </h1>

          <p className="text-xl opacity-90">
            Sistema de control de tiempos
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-1 items-center justify-center bg-gray-100 px-6">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Bienvenido
          </h2>

          <p className="text-gray-500 mb-8">
            Ingrese sus credenciales
          </p>

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
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 transition text-white py-3 rounded-xl font-semibold"
            >
              {loading
                ? "Ingresando..."
                : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}