export default function ProjectInfoCard({ proyecto, miembros, usuarios }) {
  const estados = {
    PE: "Pendiente",
    EC: "En curso",
    FI: "Finalizada",
  };

  function obtenerUsuario(usuarioId) {
    return usuarios.find(
      (usuario) => Number(usuario.id) === Number(usuarioId)
    );
  }

  return (
    <div className="rounded-3xl border-2 border-[var(--border-color)] bg-[var(--background)] p-6 text-[var(--texto)]">
      <h2 className="text-xl font-bold">
        Información del proyecto
      </h2>

      <div className="mt-6 space-y-3 text-base">
        <p>
          <span className="font-semibold">Nombre:</span>{" "}
          {proyecto.nombre}
        </p>

        <p>
          <span className="font-semibold">Descripción:</span>{" "}
          {proyecto.descripcion || "Sin descripción"}
        </p>

        <p>
          <span className="font-semibold">Materia:</span>{" "}
          {proyecto.materia}
        </p>

        <p>
          <span className="font-semibold">Estado:</span>{" "}
          {estados[proyecto.estado] || proyecto.estado}
        </p>
      </div>

      <div className="pt-4">
        <p className="font-semibold">
          Miembros:
        </p>

        <div className="mt-3 space-y-2">
          {miembros.length === 0 ? (
            <p className="text-sm text-[var(--gris)]">
              No hay miembros cargados.
            </p>
          ) : (
            miembros.map((miembro) => {
              const usuario = obtenerUsuario(miembro.usuario);

              return (
                <div key={miembro.id} className="text-sm">
                  <span className="font-semibold">
                    {usuario?.first_name || usuario?.username || "Usuario"}
                  </span>{" "}
                  <span className="text-[var(--gris)]">
                    - {miembro.rol === "OW" ? "Owner" : "Miembro"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}