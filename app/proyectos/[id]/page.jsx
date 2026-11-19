"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  GitBranch,
  Kanban,
  PenTool,
  FileText,
  Database,
  CloudUpload,
  Plug,
  FlaskConical,
  MessagesSquare,
  Link as LinkIcon,
  Plus,
  X,
} from "lucide-react";

import ProjectInfoCard from "@/components/proyectos/ProjectInfoCard";
import LinkCategoryCard from "@/components/proyectos/LinkCategoryCard";
import ProjectInvitationCard from "@/components/proyectos/ProjectInvitationCard";

import { categoriasDisponibles } from "@/lib/categoriasDisponibles";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const iconosLucide = {
  GitBranch,
  Kanban,
  PenTool,
  FileText,
  Database,
  CloudUpload,
  Plug,
  FlaskConical,
  MessagesSquare,
};

function obtenerResultados(datos) {
  return Array.isArray(datos) ? datos : datos?.results ?? [];
}

function normalizarUrl(url) {
  const urlLimpia = url.trim();

  if (
    urlLimpia.startsWith("http://") ||
    urlLimpia.startsWith("https://")
  ) {
    return urlLimpia;
  }

  return `https://${urlLimpia}`;
}

export default function DetalleProyectoPage() {
  const { id } = useParams();
  const router = useRouter();

  // Estados principales
  const [proyecto, setProyecto] = useState(null);
  const [links, setLinks] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [miembros, setMiembros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  // Formulario de categorías
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [nombrePersonalizado, setNombrePersonalizado] = useState("");
  const [descripcionCategoria, setDescripcionCategoria] = useState("");
  const [guardandoCategoria, setGuardandoCategoria] = useState(false);

  function obtenerToken() {
    const token = localStorage.getItem("access");

    if (!token) {
      router.push("/login");
      throw new Error("Tu sesión no está disponible.");
    }

    return token;
  }

  // Peticiones a Django REST Framework
  async function solicitarAPI(ruta, opciones = {}) {
    const token = obtenerToken();

    const res = await fetch(`${API_URL}${ruta}`, {
      ...opciones,
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        ...opciones.headers,
      },
    });

    if (res.status === 204) return null;

    const datos = await res.json().catch(() => null);

    if (!res.ok) {
      const detalle = datos?.detail;
      const mensaje =
        (typeof detalle === "string" && detalle) ||
        datos?.nombre?.[0] ||
        datos?.categoria?.[0] ||
        datos?.proyecto?.[0] ||
        "Ocurrió un error al comunicarse con la API.";

      throw new Error(mensaje);
    }

    return datos;
  }

  // Cargar los datos del proyecto
  useEffect(() => {
    let activo = true;

    async function fetchProyecto() {
      setLoading(true);
      setError("");

      try {
        const dataProyecto = await solicitarAPI(
          `/api/proyectos/proyectos/${id}/`
        );

        const [
          dataLinks,
          dataCategorias,
          dataMiembros,
          dataUsuarios,
        ] = await Promise.all([
          solicitarAPI(`/api/proyectos/links/?proyecto=${id}`),
          solicitarAPI(`/api/proyectos/categorias/?proyecto=${id}`),
          solicitarAPI("/api/proyectos/miembros/"),
          solicitarAPI("/api/usuarios/usuarios/"),
        ]);

        if (!activo) return;

        setProyecto(dataProyecto);
        setLinks(obtenerResultados(dataLinks));
        setCategorias(obtenerResultados(dataCategorias));

        setMiembros(
          obtenerResultados(dataMiembros).filter(
            (miembro) => Number(miembro.proyecto) === Number(id)
          )
        );

        setUsuarios(obtenerResultados(dataUsuarios));
      } catch (err) {
        if (activo) setError(err.message);
      } finally {
        if (activo) setLoading(false);
      }
    }

    fetchProyecto();

    return () => {
      activo = false;
    };
  }, [id, router]);

  // Reiniciar el formulario
  function limpiarFormularioCategoria() {
    setMostrarFormulario(false);
    setCategoriaSeleccionada("");
    setNombrePersonalizado("");
    setDescripcionCategoria("");
    setFormError("");
  }

  // Categorías sugeridas que todavía no existen
  const categoriasSugeridas = categoriasDisponibles.filter(
    (opcion) =>
      !categorias.some(
        (categoria) =>
          categoria.nombre.toLowerCase() ===
          opcion.nombre.toLowerCase()
      )
  );

  const esPersonalizada = categoriaSeleccionada === "personalizada";

  const categoriaElegida = categoriasDisponibles.find(
    (categoria) => categoria.nombre === categoriaSeleccionada
  );

  const nombreFinal = esPersonalizada
    ? nombrePersonalizado.trim()
    : categoriaSeleccionada;

  // Crear categoría
  async function handleCrearCategoria(e) {
    e.preventDefault();

    if (!nombreFinal || guardandoCategoria) return;

    const yaExiste = categorias.some(
      (categoria) =>
        categoria.nombre.toLowerCase() ===
        nombreFinal.toLowerCase()
    );

    if (yaExiste) {
      setFormError("Ya existe una categoría con ese nombre.");
      return;
    }

    setGuardandoCategoria(true);
    setFormError("");

    try {
      const nuevaCategoria = await solicitarAPI(
        "/api/proyectos/categorias/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            proyecto: Number(id),
            nombre: nombreFinal,
            descripcion: descripcionCategoria.trim() ||
              categoriaElegida?.descripcion ||
              "",
          }),
        }
      );

      setCategorias((prev) => [...prev, nuevaCategoria]);

      limpiarFormularioCategoria();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setGuardandoCategoria(false);
    }
  }

  // Editar nombre de categoría
  async function handleEditarCategoria(categoriaId, nombreNuevo) {
    setFormError("");

    try {
      const categoriaEditada = await solicitarAPI(
        `/api/proyectos/categorias/${categoriaId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: nombreNuevo.trim(),
          }),
        }
      );

      setCategorias((prev) =>
        prev.map((categoria) =>
          categoria.id === categoriaId
            ? categoriaEditada
            : categoria
        )
      );

      return true;
    } catch (err) {
      setFormError(err.message);
      return false;
    }
  }

  // Eliminar categoría
  async function handleEliminarCategoria(categoriaId) {
    setFormError("");

    try {
      await solicitarAPI(
        `/api/proyectos/categorias/${categoriaId}/`,
        {
          method: "DELETE",
        }
      );

      setCategorias((prev) =>
        prev.filter(
          (categoria) => categoria.id !== categoriaId
        )
      );

      return true;
    } catch (err) {
      setFormError(err.message);
      return false;
    }
  }

  // Crear link
  async function handleCrearLink(categoriaId, urlLink) {
    setFormError("");

    try {
      const linksDeLaCategoria = links.filter(
        (link) => Number(link.categoria) === Number(categoriaId)
      );

      const nuevoLink = await solicitarAPI(
        "/api/proyectos/links/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            proyecto: Number(id),
            titulo: `Link ${linksDeLaCategoria.length + 1}`,
            url: normalizarUrl(urlLink),
            descripcion: "",
            categoria: Number(categoriaId),
          }),
        }
      );

      setLinks((prev) => [...prev, nuevoLink]);
      return true;
    } catch (err) {
      setFormError(err.message);
      return false;
    }
  }

  // Editar link
  async function handleEditarLink(linkId, nuevaUrl) {
    setFormError("");

    try {
      const linkEditado = await solicitarAPI(
        `/api/proyectos/links/${linkId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: normalizarUrl(nuevaUrl),
          }),
        }
      );

      setLinks((prev) =>
        prev.map((link) =>
          link.id === linkId ? linkEditado : link
        )
      );

      return true;
    } catch (err) {
      setFormError(err.message);
      return false;
    }
  }

  // Eliminar link
  async function handleEliminarLink(linkId) {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar este link?"
    );

    if (!confirmar) return;

    setFormError("");

    try {
      await solicitarAPI(
        `/api/proyectos/links/${linkId}/`,
        {
          method: "DELETE",
        }
      );

      setLinks((prev) =>
        prev.filter((link) => link.id !== linkId)
      );
    } catch (err) {
      setFormError(err.message);
    }
  }

  if (loading) {
    return <p className="p-8">Cargando proyecto...</p>;
  }

  if (error) {
    return (
      <p className="p-8 text-[var(--rojo)]">
        {error}
      </p>
    );
  }

  // Asociar los enlaces con sus categorías
  const categoriasConLinks = categorias.map((categoria) => ({
    ...categoria,
    links: links.filter(
      (link) =>
        Number(link.categoria) === Number(categoria.id)
    ),
  }));

  return (
    <section className="min-h-[80vh] bg-gradient-to-r from-[var(--background)] via-[var(--background)] to-black px-8 py-20">
      <div className="mx-auto max-w-7xl">

        {formError && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-[var(--rojo)] p-4 text-[var(--rojo)]"
          >
            {formError}
          </div>
        )}

        {/* Botón para abrir el formulario */}
        <div className="mt-12 flex justify-end">
          <button
            type="button"
            onClick={() => {
              limpiarFormularioCategoria();
              setMostrarFormulario(true);
            }}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--verde)] px-5 py-3 font-semibold text-white transition duration-200 ease-in-out hover:scale-105 hover:opacity-90 active:scale-95"

          >
            <Plus size={20} />
            Nueva categoría
          </button>
        </div>

        {/* Formulario visual para nuevas categorías */}
        {mostrarFormulario && (
          <form
            onSubmit={handleCrearCategoria}
            className="mt-6 space-y-5 rounded-2xl border border-[var(--border-color)] bg-[var(--background)] p-6 text-[var(--texto)]"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Crear nueva categoría
              </h2>

              <button
                type="button"
                onClick={limpiarFormularioCategoria}
                aria-label="Cerrar formulario"
                className="hover:text-[var(--rojo)]"
              >
                <X size={22} />
              </button>
            </div>

            <p className="text-sm text-[var(--gris)]">
              Seleccioná una categoría sugerida o creá una personalizada.
            </p>

            {/* Selector visual */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {categoriasSugeridas.map((opcion) => {
                const Icono = iconosLucide[opcion.icono] || LinkIcon;
                const seleccionada =
                  categoriaSeleccionada === opcion.nombre;

                return (
                  <button
                    key={opcion.nombre}
                    type="button"
                    onClick={() => {
                      setCategoriaSeleccionada(opcion.nombre);
                      setFormError("");
                    }}
                    aria-pressed={seleccionada}
                    className={`flex min-h-28 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border p-4 transition ${
                      seleccionada
                        ? "border-[var(--verde)] bg-[var(--verde)]/10 text-[var(--verde)]"
                        : "border-[var(--border-color)] hover:border-[var(--verde)]"
                    }`}
                  >
                    <Icono size={35} strokeWidth={1.5} />
                    <span className="text-center text-sm font-semibold">
                      {opcion.nombre}
                    </span>
                  </button>
                );
              })}

              {/* Opción personalizada */}
              <button
                type="button"
                onClick={() => {
                  setCategoriaSeleccionada("personalizada");
                  setFormError("");
                }}
                aria-pressed={esPersonalizada}
                className={`flex min-h-28 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border p-4 transition ${
                  esPersonalizada
                    ? "border-[var(--verde)] bg-[var(--verde)]/10 text-[var(--verde)]"
                    : "border-[var(--border-color)] hover:border-[var(--verde)]"
                }`}
              >
                <LinkIcon size={35} strokeWidth={1.5} />
                <span className="text-center text-sm font-semibold">
                  Personalizada
                </span>
              </button>
            </div>

            {/* Campo para categoría personalizada */}
            {esPersonalizada && (
              <div className="space-y-2">
                <label
                  htmlFor="nombre-personalizado"
                  className="block font-medium"
                >
                  Nombre de la categoría
                </label>

                <input
                  id="nombre-personalizado"
                  type="text"
                  value={nombrePersonalizado}
                  onChange={(e) =>
                    setNombrePersonalizado(e.target.value)
                  }
                  maxLength={50}
                  required
                  placeholder="Ej.: Recursos de aprendizaje"
                  className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-3 outline-none focus:border-[var(--verde)]"
                />
              </div>
            )}

            {/* Descripción */}
            <div className="space-y-2">
              <label
                htmlFor="descripcion-categoria"
                className="block font-medium"
              >
                Descripción (opcional)
              </label>

              <textarea
                id="descripcion-categoria"
                value={descripcionCategoria}
                onChange={(e) =>
                  setDescripcionCategoria(e.target.value)
                }
                rows={2}
                maxLength={100}
                placeholder={
                  categoriaElegida?.descripcion ||
                  "¿Qué enlaces vas a guardar?"
                }
                className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-3 outline-none focus:border-[var(--verde)]"
              />
            </div>

            {/* Vista previa */}
            {categoriaSeleccionada && (
              <div className="rounded-xl border border-[var(--border-color)] p-4">
                <p className="mb-3 text-sm text-[var(--gris)]">
                  Vista previa
                </p>

                <div className="flex items-center gap-4">
                  {(() => {
                    const Icono = esPersonalizada
                      ? LinkIcon
                      : iconosLucide[categoriaElegida?.icono] || LinkIcon;

                    return (
                      <Icono
                        size={48}
                        strokeWidth={1.5}
                        className="text-[var(--verde)]"
                      />
                    );
                  })()}

                  <div>
                    <h3 className="font-bold">
                      {nombreFinal || "Nueva categoría"}
                    </h3>
                    <p className="text-sm text-[var(--gris)]">
                      {descripcionCategoria ||
                        categoriaElegida?.descripcion ||
                        "Categoría personalizada"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={!nombreFinal || guardandoCategoria}
                className="rounded-xl bg-[var(--verde)] px-5 py-3 font-semibold text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {guardandoCategoria
                  ? "Guardando..."
                  : "Crear categoría"}
              </button>

              <button
                type="button"
                onClick={limpiarFormularioCategoria}
                className="rounded-xl border border-[var(--border-color)] px-5 py-3 transition hover:opacity-80"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Cards del proyecto */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ProjectInfoCard
            proyecto={proyecto}
            miembros={miembros}
            usuarios={usuarios}
          />

          <ProjectInvitationCard proyectoId={id} />

          {categoriasConLinks.map((categoria) => (
            <LinkCategoryCard
              key={categoria.id}
              categoria={categoria}
              handleCrearLink={handleCrearLink}
              handleEditarLink={handleEditarLink}
              handleEliminarLink={handleEliminarLink}
              handleEditarCategoria={handleEditarCategoria}
              handleEliminarCategoria={handleEliminarCategoria}
            />
          ))}
        </div>

        {categorias.length === 0 && (
          <p className="mt-8 text-center text-[var(--gris)]">
            Este proyecto todavía no tiene categorías.
            Creá una para empezar a organizar tus enlaces.
          </p>
        )}
      </div>
    </section>
  );
}
