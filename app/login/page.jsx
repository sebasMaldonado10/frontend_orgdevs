"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!res.ok) {
        throw new Error("Usuario o contraseña incorrectos");
      }

      const data = await res.json();

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      router.push("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-[80vh] bg-gradient-to-r from-[var(--background)] via-[var(--background)] to-black px-8 py-20 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-[var(--background)] p-8 shadow-2xl">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[var(--texto)]">
            Iniciar sesión
          </h1>

          <p className="mt-2 text-sm text-[var(--gris)]">
            Accedé a tus proyectos académicos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--texto)]">
              Usuario
            </label>

            <input
              type="text"
              name="username"
              value = {username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresá tu usuario"
              className="w-full rounded-lg border border-[var(--border-color)] bg-transparent px-4 py-3 text-[var(--texto)] outline-none placeholder:text-[var(--gris)] focus:border-[var(--verde)]"
            />

            {error && (
              <p className="text-sm text-[var(--rojo)]">
                {error}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--texto)]">
              Contraseña
            </label>

            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresá tu contraseña"
              className="w-full rounded-lg border border-[var(--border-color)] bg-transparent px-4 py-3 text-[var(--texto)] outline-none placeholder:text-[var(--gris)] focus:border-[var(--verde)]"
            />

            {error && (
              <p className="text-sm text-[var(--rojo)]">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--verde)] px-4 py-3 text-lg font-semibold text-[var(--background)] hover:cursor-pointer transition delay-50 duration-300 ease-in-out hover:-translate-y-1 hover:opacity-75"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--gris)]">
          ¿No tenés cuenta?{" "}
          <Link href="/register" className="text-[var(--verde)] hover:underline">
            Registrate
          </Link>
        </p>
      </div>
    </section>
  );
}

