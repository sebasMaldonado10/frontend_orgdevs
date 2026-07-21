"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CrearProyectoPage() {
  const router = useRouter();

  // Usuarios disponibles para agregar como miembros
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioActualId, setUsuarioActualId] = useState(null);
  const [miembrosSeleccionados, setMiembrosSeleccionados] = useState([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Datos del nuevo proyecto
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [materia, setMateria] = useState("");
  const [estado, setEstado] = useState("EC");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function cargarUsuarios() {
      const token = localStorage.getItem("access");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Traemos el usuario actual para no mostrarlo como opción.
        const resUsuarioActual = await fetch(`${API_URL}/api/usuarios/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!resUsuarioActual.ok) {
          throw new Error("No se pudo cargar el usuario actual");
        }

        const dataUsuarioActual = await resUsuarioActual.json();
        setUsuarioActualId(dataUsuarioActual.id);

        // Traemos todos los usuarios disponibles.
        const resUsuarios = await fetch(`${API_URL}/api/usuarios/usuarios/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!resUsuarios.ok) {
          throw new Error("No se pudieron cargar los usuarios");
        }

        const dataUsuarios = await resUsuarios.json();
        setUsuarios(dataUsuarios);
      } catch (error) {
        setError(error.message);
      }
    }

    cargarUsuarios();
  }, [router]);

  function handleToggleMiembro(usuarioId) {
    const id = String(usuarioId);

    if (miembrosSeleccionados.includes(id)) {
      setMiembrosSeleccionados(
        miembrosSeleccionados.filter((miembroId) => miembroId !== id)
      );
    } else {
      setMiembrosSeleccionados([...miembrosSeleccionados, id]);
    }
  }

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
      // 1. Creamos el proyecto.
      const resProyecto = await fetch(`${API_URL}/api/proyectos/proyectos/`, {
        method: "POST",
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
      });

      if (!resProyecto.ok) {
        throw new Error("No se pudo crear el proyecto");
      }

      const proyectoCreado = await resProyecto.json();

      // 2. Agregamos los miembros seleccionados como miembros del proyecto.
      await Promise.all(
        miembrosSeleccionados.map((usuarioId) =>
          fetch(`${API_URL}/api/proyectos/miembros/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              usuario: Number(usuarioId),
              proyecto: proyectoCreado.id,
              rol: "MB",
            }),
          })
        )
      );

      // 3. Redirigimos al detalle del proyecto creado.
      router.push(`/proyectos/${proyectoCreado.id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const usuariosDisponibles = usuarios.filter(
    (usuario) => Number(usuario.id) !== Number(usuarioActualId)
  );

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-gradient-to-r from-[var(--background)] via-[var(--background)] to-black px-8 py-20">
      <div className="w-full max-w-lg rounded-2xl border-2 border-[var(--border-color)] bg-[var(--background)] p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-[var(--texto)]">
          Crear proyecto
        </h1>

        <p className="mt-2 text-sm text-[var(--texto)]">
          Cargá los datos principales de tu proyecto académico.
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

          <div>
            <label className="mb-2 block text-base font-medium text-[var(--texto)]">
              Miembros del proyecto:
            </label>

            <div className="max-h-56 overflow-y-auto rounded-sm border border-[var(--border-color)] bg-[var(--background)] p-3">
              {usuariosDisponibles.length === 0 ? (
                <p className="text-sm text-[var(--gris)]">
                  No hay usuarios disponibles para agregar.
                </p>
              ) : (
                usuariosDisponibles.map((usuario) => {
                  const usuarioId = String(usuario.id);
                  const seleccionado = miembrosSeleccionados.includes(usuarioId);

                  return (
                    <label
                      key={usuario.id}
                      className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 ${
                        seleccionado
                          ? "border-[var(--verde)] bg-[var(--azul)]"
                          : "border-transparent hover:border-[var(--verde)] hover:bg-[var(--azul)]"
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-[var(--texto)]">
                          {usuario.first_name || usuario.username}
                        </p>

                        <p className="text-xs text-[var(--gris)]">
                          {usuario.email}
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        checked={seleccionado}
                        onChange={() => handleToggleMiembro(usuario.id)}
                        className="h-4 w-4 accent-[var(--verde)]"
                      />
                    </label>
                  );
                })
              )}
            </div>

            <p className="mt-2 text-xs text-[var(--gris)]">
              Seleccioná los compañeros que van a participar en este proyecto.
            </p>
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
            {loading ? "Creando..." : "Crear proyecto"}
          </button>
        </form>
      </div>
    </section>
  );
}