export default function ProjectInfoCard({ proyecto }) {
  const estados = {
    PE: "Pendiente",
    EC: "En curso",
    FI: "Finalizada",
  };

  return (
    // CARD
    <div className="rounded-3xl border-2 border-[var(--border-color)] bg-[var(--background)] p-6 text-[var(--texto)]">

      <h2 className="text-xl font-bold">
        Información del proyecto
      </h2>

      <div className="mt-6 space-y-4 text-base">
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
    </div>
  );
}
