"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UnirseProyectoPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function aceptarInvitacion(e) {
    e.preventDefault();

    const token = localStorage.getItem("access");

    if (!token) {
      router.push("/login");
      return;
    }

    if (!codigo.trim()) {
      setError("Ingresá un código de invitación.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/proyectos/aceptar-invitacion/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          codigo: codigo.trim().toUpperCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "No se pudo aceptar la invitación");
      }

      router.push(`/proyectos/${data.proyecto_id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-gradient-to-r from-[var(--background)] via-[var(--background)] to-black px-8 py-20">
      <div className="w-full max-w-lg rounded-2xl border-2 border-[var(--border-color)] bg-[var(--background)] p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-[var(--texto)]">
          Unirse a un proyecto
        </h1>

        <p className="mt-2 text-sm text-[var(--gris)]">
          Pegá el código de invitación que te compartió un compañero.
        </p>

        <form onSubmit={aceptarInvitacion} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-base font-medium text-[var(--texto)]">
              Código de invitación:
            </label>

            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ej: CF1A54ED98"
              className="w-full rounded-lg border border-[var(--border-color)] bg-transparent px-4 py-3 uppercase text-[var(--texto)] outline-none placeholder:normal-case placeholder:text-[var(--gris)] focus:border-[var(--verde)]"
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--rojo)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-lg bg-[var(--verde)] px-4 py-3 text-lg font-semibold text-[var(--background)] transition duration-300 hover:-translate-y-1 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading ? "Uniéndote..." : "Unirme al proyecto"}
          </button>
        </form>
      </div>
    </section>
  );
}