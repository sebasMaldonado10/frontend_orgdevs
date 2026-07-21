"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function InvitacionPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const params = useParams();
  const router = useRouter();

  const codigo = params.codigo;

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  async function aceptarInvitacion() {
    const token = localStorage.getItem("access");

    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setMensaje("");
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/proyectos/aceptar-invitacion/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          codigo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "No se pudo aceptar la invitación");
      }

      setMensaje(data.detail);

      setTimeout(() => {
        router.push(`/proyectos/${data.proyecto_id}`);
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-[80vh] bg-gradient-to-r from-[var(--background)] via-[var(--background)] to-black px-8 py-20">
      <div className="mx-auto max-w-xl rounded-3xl border-2 border-[var(--border-color)] bg-[var(--background)] p-8 text-center text-[var(--texto)]">
        <h1 className="text-3xl font-bold">
          Invitación a proyecto
        </h1>

        <p className="mt-4 text-[var(--gris)]">
          Recibiste una invitación para unirte a un proyecto en OrganizaDevs.
        </p>

        <div className="mt-6 rounded-xl border border-[var(--border-color)] bg-[var(--card)] p-4">
          <p className="text-sm text-[var(--gris)]">
            Código de invitación
          </p>

          <p className="mt-2 text-xl font-bold text-[var(--verde)]">
            {codigo}
          </p>
        </div>

        {mensaje && (
          <p className="mt-5 text-sm text-[var(--verde)]">
            {mensaje}
          </p>
        )}

        {error && (
          <p className="mt-5 text-sm text-[var(--rojo)]">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={aceptarInvitacion}
          disabled={loading}
          className="mt-8 w-full rounded-xl bg-[var(--verde)] px-4 py-3 font-semibold text-[var(--background)] transition hover:opacity-80 disabled:opacity-50"
        >
          {loading ? "Aceptando..." : "Aceptar invitación"}
        </button>
      </div>
    </section>
  );
}