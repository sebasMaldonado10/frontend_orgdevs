"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();

  // Para manejar el menu de editar y eliminar
  const [menuAbierto, setMenuAbierto] = useState(null);

  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProyectos() {
      const token = localStorage.getItem("access");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/proyectos/proyectos/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("No se pudieron cargar los proyectos");
        }

        const data = await res.json();
        setProyectos(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProyectos();
  }, [router]);

  async function handleEliminarProyecto(proyectoId) {
      const confirmar = confirm("¿Seguro que querés eliminar este proyecto?");

      if (!confirmar) {
        return;
      }

      // Obtenemos el token
      const token = localStorage.getItem("access");

      if (!token) {
        router.push("/login"); // Si no estoy logeado me redirigue al login
        return;
      }

      try {
        const res = await fetch(
          // Una vez autenticados, obtenemos el ID del proyecto
          `http://127.0.0.1:8000/api/proyectos/proyectos/${proyectoId}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("No se pudo eliminar el proyecto");
        }

        setProyectos(
          proyectos.filter((proyecto) => proyecto.id !== proyectoId)
        );

        setMenuAbierto(null);
      } catch (error) {
        setError(error.message);
      }
    }

  if (loading) {
    return <p className="p-8">Cargando proyectos...</p>;
  }

  return (
    <section className="min-h-[80vh] bg-gradient-to-r from-[var(--background)] via-[var(--background)] to-black px-8 py-20">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold">Mis proyectos</h1>

        <p className="mt-3 text-[var(--gris)]">
          Estos son los proyectos donde participás.
        </p>


        {error && (
          <p className="mt-6 text-[var(--rojo)]">{error}</p>
        )}

        {proyectos.length === 0 && !error && (
            <div className="mt-10 text-center">
                <h2 className="text-2xl font-semibold">Todavía no tenés proyectos</h2>

                <p className="mt-3 text-[var(--gris)]">
                Creá tu primer proyecto para empezar a organizar tus links.
                </p>
            </div>
            )}

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">

            <Link
              href="/proyectos/nuevo"
              className="flex min-h-56 flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--border-color)] bg-[var(--background)] p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:border-[var(--verde)] hover:shadow-xl"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--verde)] text-3xl text-[var(--verde)]">
                +
              </div>

              <h2 className="text-xl font-semibold text-[var(--texto)]">
                Crear proyecto
              </h2>

              <p className="mt-3 text-sm text-[var(--gris)]">
                Agregá un nuevo proyecto académico para organizar sus links.
              </p>
            </Link>

            {proyectos.map((proyecto) => (
              <div
                key={proyecto.id}
                className="relative rounded-xl border-2 border-[var(--border-color)] bg-[var(--background)] p-6 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <button
                  type="button"
                  onClick={() =>
                    setMenuAbierto(menuAbierto === proyecto.id ? null : proyecto.id)
                  }
                  className="absolute right-4 top-4 rounded-full px-2 py-1 cursor-pointer text-xl text-[var(--texto)] transition hover:bg-[var(--card)] hover:text-[var(--azul)]"
                >
                  ⋮
                </button>

                {menuAbierto === proyecto.id && (
                  <div className="absolute right-4 top-12 z-10 w-32 rounded-xl border border-[var(--border-color)] bg-[var(--background)] p-2 shadow-xl">
                    <Link
                      href={`/proyectos/${proyecto.id}/editar`}
                      className="block rounded-lg px-3 py-2 text-sm text-[var(--texto)] transition hover:bg-[var(--card)] hover:text-[var(--azul)]"
                    >
                      Editar
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleEliminarProyecto(proyecto.id)}
                      className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-[var(--texto)] transition hover:bg-[var(--card)] hover:text-[var(--azul)]"
                    >
                      Eliminar
                    </button>
                  </div>
                )}

                <h2 className="pr-8 text-center text-xl font-semibold">
                  {proyecto.nombre}
                </h2>

                <p className="mt-3 text-sm text-[var(--gris)]">
                  {proyecto.descripcion || "Sin descripción"}
                </p>

                <p className="mt-4 text-sm">
                  Materia: {proyecto.materia}
                </p>

                <p className="mt-2 text-sm">
                  Entrega: {proyecto.fecha_entrega || "Sin fecha"}
                </p>

                <p className="mt-2 text-sm text-[var(--verde)]">
                  Estado: {proyecto.estado}
                </p>

                <Link
                  href={`/proyectos/${proyecto.id}`}
                  className="mt-6 block w-full rounded-lg border border-[var(--border-color)] px-4 py-2 text-center text-sm font-semibold transition hover:bg-[var(--verde)] hover:text-[var(--background)]"
                >
                  Ver proyecto
                </Link>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
