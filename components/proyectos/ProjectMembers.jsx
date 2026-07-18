"use client"; // Componente interactivo

import { useState } from "react"; // Para manejar estados

export default function ProjectMembers({
  miembros,
  usuarios,
  handleAgregarMiembro,
}) {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");

  const idsMiembros = miembros.map((miembro) => Number(miembro.usuario));

  const usuariosDisponibles = usuarios.filter(
    (usuario) => !idsMiembros.includes(Number(usuario.id))
  );

  function obtenerUsuario(usuarioId) {
    return usuarios.find((usuario) => Number(usuario.id) === Number(usuarioId));
  }

  async function agregarMiembro() {
    if (!usuarioSeleccionado) return;

    const agregado = await handleAgregarMiembro(usuarioSeleccionado);

    if (agregado) {
      setUsuarioSeleccionado("");
    }
  }

  return (
    <div className="mt-10 rounded-3xl border border-[var(--border-color)] bg-[var(--background)] p-6 text-[var(--texto)]">
      <h2 className="text-2xl font-bold">
        Miembros del proyecto
      </h2>

      <div className="mt-6 space-y-3">
        {miembros.length === 0 ? (
          <p className="text-sm text-[var(--gris)]">
            Todavía no hay miembros.
          </p>
        ) : (
          miembros.map((miembro) => {
            const usuario = obtenerUsuario(miembro.usuario);

            return (
              <div
                key={miembro.id}
                className="flex items-center justify-between rounded-xl border border-[var(--border-color)] p-3"
              >
                <div>
                  <p className="font-semibold">
                    {usuario?.first_name || usuario?.username || "Usuario"}
                  </p>

                  <p className="text-sm text-[var(--gris)]">
                    Rol: {miembro.rol === "OW" ? "Owner" : "Miembro"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <select
          value={usuarioSeleccionado}
          onChange={(e) => setUsuarioSeleccionado(e.target.value)}
          className="flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-4 py-3 outline-none focus:border-[var(--verde)]"
        >
          <option value="">Seleccionar usuario</option>

          {usuariosDisponibles.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.first_name || usuario.username}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={agregarMiembro}
          className="cursor-pointer rounded-lg bg-[var(--verde)] px-5 py-3 font-semibold text-[var(--background)] transition hover:opacity-75"
        >
          Agregar miembro
        </button>
      </div>
    </div>
  );
}