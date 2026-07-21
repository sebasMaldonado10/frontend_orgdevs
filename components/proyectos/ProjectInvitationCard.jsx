"use client";

import { useState } from "react";

export default function ProjectInvitationCard({ proyectoId }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [codigo, setCodigo] = useState("");
  const [linkInvitacion, setLinkInvitacion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function generarInvitacion() {
    const token = localStorage.getItem("access");

    if (!token) {
      setError("Tenés que iniciar sesión.");
      return;link
    }

    setError("");
    setMensaje("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/proyectos/invitaciones/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          proyecto: Number(proyectoId),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "No se pudo generar la invitación");
      }

      const link = `${window.location.origin}/invitacion/${data.codigo}`;

      setCodigo(data.codigo);
      setLinkInvitacion(link);
      setMensaje("Invitación generada correctamente.");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function copiarCodigo() {
    if (!codigo) return;

    await navigator.clipboard.writeText(codigo);
    setMensaje("Código copiado al portapapeles.");
}

  return (
    <div className="rounded-3xl border-2 border-[var(--border-color)] bg-[var(--background)] p-6 text-[var(--texto)] transition-all duration-300 hover:-translate-y-2 hover:border-[var(--border-color)] hover:shadow-xl">
      <h3 className="text-xl font-bold">
        Invitar miembros
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-[var(--gris)]">
        Generá un link privado para que otro usuario pueda unirse a este proyecto.
      </p>

      {mensaje && (
        <p className="mt-4 text-sm text-[var(--verde)]">
          {mensaje}
        </p>
      )}

      {error && (
        <p className="mt-4 text-sm text-[var(--rojo)]">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={generarInvitacion}
        disabled={loading}
        className="mt-5 w-full cursor-pointer rounded-xl bg-[var(--verde)] px-4 py-3 font-semibold text-[var(--background)] transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Generando..." : "Generar invitación"}
      </button>

      {codigo && (
        <div className="mt-5 rounded-xl border border-[var(--border-color)] bg-[var(--card)] p-4">
          <p className="text-sm text-[var(--gris-inv)]">
            Código de invitación
          </p>

          <p className="mt-1 text-lg font-bold tracking-widest text-[var(--verde)]">
            {codigo}
          </p>

          <p className="mt-4 break-all text-sm text-[var(--gris-inv)]">
            {linkInvitacion}
          </p>

          <button
            type="button"
            onClick={copiarCodigo}
            className="mt-4 w-full cursor-pointer rounded-lg border border-[var(--verde)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--verde)] transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--verde)] hover:text-[var(--background)] hover:shadow-lg"
          >
            Copiar código
          </button>

          <p className="mt-3 text-xs text-[var(--gris-inv)]">
            Este link puede ser usado una sola vez.
          </p>
        </div>
      )}
    </div>
  );
}