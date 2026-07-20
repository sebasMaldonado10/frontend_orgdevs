"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditarProyectoPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id;

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [materia, setMateria] = useState("");
  const [estado, setEstado] = useState("EC");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cargandoProyecto, setCargandoProyecto] = useState(true);

  useEffect(() => {
    async function cargarProyecto() {
      const token = localStorage.getItem("access");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/proyectos/proyectos/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("No se pudo cargar el proyecto");
        }

        const data = await res.json();

        setNombre(data.nombre);
        setDescripcion(data.descripcion || "");
        setFechaEntrega(data.fecha_entrega || "");
        setMateria(data.materia);
        setEstado(data.estado);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargandoProyecto(false);
      }
    }

    cargarProyecto();
  }, [id, router]);

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("access");

    if (!token) {
      router.push("/login");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/proyectos/proyectos/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre,
            descripcion,
            fecha_entrega: fechaEntrega || null,
            materia,
            estado,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("No se pudo editar el proyecto");
      }

      router.push(`/proyectos/${id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (cargandoProyecto) {
    return (
      <p className="p-8 text-[var(--texto)]">
        Cargando proyecto...
      </p>
    );
  }

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-gradient-to-r from-[var(--background)] via-[var(--background)] to-black px-8 py-20">
      <div className="w-full max-w-lg rounded-2xl border-2 border-[var(--border-color)] bg-[var(--background)] p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-[var(--texto)]">
          Editar proyecto
        </h1>

        <p className="mt-2 text-sm text-[var(--gris)]">
          Modificá los datos principales de tu proyecto.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-base font-medium text-[var(--texto)]">
              Nombre:
            </label>

            <input
              type="text"
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del proyecto"
              required
              className="w-full rounded-lg border border-[var(--border-color)] bg-transparent px-4 py-3 text-[var(--texto)] outline-none placeholder:text-[var(--gris)] focus:border-[var(--verde)]"
            />
          </div>

          <div>
            <label className="mb-2 block text-base font-medium text-[var(--texto)]">
              Descripción:
            </label>

            <input
              type="text"
              name="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción del proyecto"
              className="w-full rounded-lg border border-[var(--border-color)] bg-transparent px-4 py-3 text-[var(--texto)] outline-none placeholder:text-[var(--gris)] focus:border-[var(--verde)]"
            />
          </div>

          <div>
            <label className="mb-2 block text-base font-medium text-[var(--texto)]">
              Fecha de entrega:
            </label>

            <input
              type="date"
              name="fecha_entrega"
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-color)] bg-transparent px-4 py-3 text-[var(--texto)] outline-none focus:border-[var(--verde)]"
            />
          </div>

          <div>
            <label className="mb-2 block text-base font-medium text-[var(--texto)]">
              Materia:
            </label>

            <input
              type="text"
              name="materia"
              value={materia}
              onChange={(e) => setMateria(e.target.value)}
              placeholder="Materia"
              required
              className="w-full rounded-lg border border-[var(--border-color)] bg-transparent px-4 py-3 text-[var(--texto)] outline-none placeholder:text-[var(--gris)] focus:border-[var(--verde)]"
            />
          </div>

          <div>
            <label className="mb-2 block text-base font-medium text-[var(--texto)]">
              Estado:
            </label>

            <select
              name="estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full cursor-pointer rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-4 py-3 text-[var(--texto)] outline-none focus:border-[var(--verde)]"
            >
              <option value="PE">Pendiente</option>
              <option value="EC">En Curso</option>
              <option value="FI">Finalizada</option>
            </select>
          </div>

          {error && (
            <p className="text-sm text-[var(--rojo)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-lg bg-[var(--verde)] px-4 py-3 text-lg font-semibold text-[var(--background)] transition duration-300 ease-in-out hover:-translate-y-1 hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </section>
  );
}