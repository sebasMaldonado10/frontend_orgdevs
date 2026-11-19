
"use client";

import { useEffect, useState } from "react";

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
  Pencil,
  Trash2,
  Check,
  X,
  ExternalLink,
  Plus,
  Minus,
} from "lucide-react";

import { obtenerCategoriaVisual } from "@/lib/categoriasDisponibles";

// Relacionamos los nombres de los íconos con Lucide React
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

// Muestra el ícono correspondiente a cada categoría
function IconoCategoria({ nombre }) {
  const categoriaVisual = obtenerCategoriaVisual(nombre);

  const Icono = iconosLucide[categoriaVisual?.icono] || LinkIcon;

  return (
    <Icono
      size={110}
      strokeWidth={1.5}
      aria-label={`Ícono de ${nombre}`}
      className="text-[var(--verde)]"
    />
  );
}

export default function LinkCategoryCard({
  categoria,
  handleCrearLink,
  handleEditarLink,
  handleEliminarLink,
  handleEditarCategoria,
  handleEliminarCategoria,
}) {
  // Estados para administrar los enlaces
  const [nuevoLink, setNuevoLink] = useState("");
  const [linksEditados, setLinksEditados] = useState({});

  // Estados para editar la categoría
  const [editandoCategoria, setEditandoCategoria] = useState(false);
  const [nombreCategoria, setNombreCategoria] = useState(categoria.nombre);
  const [guardandoCategoria, setGuardandoCategoria] = useState(false);

  // Sincronizamos el nombre cuando la categoría cambia
  useEffect(() => {
    if (!editandoCategoria) {
      setNombreCategoria(categoria.nombre);
    }
  }, [categoria.nombre, editandoCategoria]);

  // Obtiene el valor actual de un enlace
  function obtenerValorLink(link) {
    return linksEditados[link.id] ?? link.url ?? "";
  }

  // Normaliza la URL para abrirla en otra pestaña
  function obtenerHref(link) {
    const valor = obtenerValorLink(link).trim();

    if (!valor) return "#";

    if (
      valor.startsWith("http://") ||
      valor.startsWith("https://")
    ) {
      return valor;
    }

    return `https://${valor}`;
  }

  // Crear un enlace nuevo
  async function guardarNuevoLink() {
    if (!nuevoLink.trim()) return;

    const creado = await handleCrearLink(
      categoria.id,
      nuevoLink
    );

    if (creado) {
      setNuevoLink("");
    }
  }

  // Editar un enlace existente
  async function guardarEdicion(link) {
    const nuevaUrl = linksEditados[link.id];

    if (nuevaUrl === undefined || !nuevaUrl.trim()) return;
    if (nuevaUrl.trim() === link.url) return;

    const editado = await handleEditarLink(
      link.id,
      nuevaUrl
    );

    if (editado) {
      setLinksEditados((prev) => {
        const copia = { ...prev };
        delete copia[link.id];
        return copia;
      });
    }
  }

  // Guardar los cambios del nombre de la categoría
  async function guardarNombreCategoria() {
    const nombre = nombreCategoria.trim();

    if (!nombre || guardandoCategoria) return;

    if (nombre === categoria.nombre) {
      setEditandoCategoria(false);
      return;
    }

    setGuardandoCategoria(true);

    try {
      const editado = await handleEditarCategoria(
        categoria.id,
        nombre
      );

      if (editado) {
        setEditandoCategoria(false);
      }
    } finally {
      setGuardandoCategoria(false);
    }
  }

  // Cancelar la edición de la categoría
  function cancelarEdicionCategoria() {
    setNombreCategoria(categoria.nombre);
    setEditandoCategoria(false);
  }

  // Eliminar una categoría vacía
  async function eliminarCategoria() {
    if (categoria.links.length > 0) {
      alert(
        "Esta categoría contiene enlaces. Primero debés eliminarlos o moverlos."
      );
      return;
    }

    const confirmar = window.confirm(
      `¿Querés eliminar la categoría "${categoria.nombre}"?`
    );

    if (!confirmar) return;

    await handleEliminarCategoria(categoria.id);
  }

  return (
    <div className="flex h-[430px] flex-col overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--background)] p-6 text-[var(--texto)] transition-all duration-300 hover:-translate-y-2 hover:border-[var(--border-color)] hover:shadow-xl">

      {/* TÍTULO Y ACCIONES DE LA CATEGORÍA */}
      <div className="flex shrink-0 items-center justify-between gap-2">
        {editandoCategoria ? (
          <div className="flex w-full items-center gap-2">
            <input
              type="text"
              value={nombreCategoria}
              onChange={(e) => setNombreCategoria(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  guardarNombreCategoria();
                }

                if (e.key === "Escape") {
                  cancelarEdicionCategoria();
                }
              }}
              maxLength={50}
              aria-label="Nombre de la categoría"
              className="min-w-0 flex-1 rounded-lg border border-[var(--border-color)] bg-transparent px-2 py-1 outline-none focus:border-[var(--verde)]"
            />

            <button
              type="button"
              title="Guardar nombre"
              aria-label="Guardar nombre"
              disabled={guardandoCategoria || !nombreCategoria.trim()}
              onClick={guardarNombreCategoria}
              className="cursor-pointer text-[var(--verde)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={20} />
            </button>

            <button
              type="button"
              title="Cancelar edición"
              aria-label="Cancelar edición"
              disabled={guardandoCategoria}
              onClick={cancelarEdicionCategoria}
              className="cursor-pointer text-[var(--rojo)] disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <>
            <h3 className="min-w-0 flex-1 break-words text-center text-xl font-bold">
              Link de {categoria.nombre}
            </h3>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                title="Editar categoría"
                aria-label={`Editar categoría ${categoria.nombre}`}
                onClick={() => {
                  setNombreCategoria(categoria.nombre);
                  setEditandoCategoria(true);
                }}
                className="cursor-pointer transition-colors hover:text-[var(--verde)]"
              >
                <Pencil size={18} />
              </button>

              <button
                type="button"
                title="Eliminar categoría"
                aria-label={`Eliminar categoría ${categoria.nombre}`}
                onClick={eliminarCategoria}
                className="cursor-pointer transition-colors hover:text-[var(--rojo)]"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 shrink-0 border-t-2 border-[var(--border-color)]" />

      {/* ÍCONO DINÁMICO DE LA CATEGORÍA */}
      <div className="mt-2 flex min-h-36 flex-1 items-center justify-center">
        <IconoCategoria nombre={categoria.nombre} />
      </div>

      {/* ENLACES EXISTENTES */}
      {categoria.links.length > 0 && (
        <div className="mb-3 max-h-28 shrink-0 space-y-2 overflow-y-auto pr-2">
          {categoria.links.map((link) => (
            <div key={link.id} className="flex items-center gap-2">
              <span className="shrink-0 font-semibold">
                Link:
              </span>

              <input
                type="url"
                value={obtenerValorLink(link)}
                onChange={(e) =>
                  setLinksEditados((prev) => ({
                    ...prev,
                    [link.id]: e.target.value,
                  }))
                }
                onBlur={() => guardarEdicion(link)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    guardarEdicion(link);
                  }
                }}
                aria-label={`Editar enlace ${link.titulo}`}
                className="min-w-0 flex-1 border-b border-dashed border-[var(--border-color)] bg-transparent px-2 py-1 text-sm outline-none focus:border-[var(--verde)]"
              />

              <a
                href={obtenerHref(link)}
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir link"
                aria-label={`Abrir enlace ${link.titulo}`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-color)] hover:border-[var(--verde)] hover:text-[var(--verde)]"
              >
                <ExternalLink size={16} />
              </a>

              <button
                type="button"
                title="Eliminar link"
                aria-label={`Eliminar enlace ${link.titulo}`}
                onClick={() => handleEliminarLink(link.id)}
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--border-color)] hover:border-[var(--rojo)] hover:text-[var(--rojo)]"
              >
                <Minus size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* AGREGAR NUEVO ENLACE */}
      <div className="flex shrink-0 items-center gap-2 border-t border-[var(--border-color)] pt-3">
        <span className="shrink-0 font-semibold">
          Link:
        </span>

        <input
          type="url"
          value={nuevoLink}
          onChange={(e) => setNuevoLink(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              guardarNuevoLink();
            }
          }}
          placeholder="Pegá un link..."
          aria-label={`Nuevo enlace para ${categoria.nombre}`}
          className="min-w-0 flex-1 border-b border-dashed border-[var(--border-color)] bg-transparent px-2 py-1 text-sm outline-none placeholder:text-[var(--gris)] focus:border-[var(--verde)]"
        />

        <button
          type="button"
          title="Agregar link"
          aria-label={`Agregar enlace a ${categoria.nombre}`}
          onClick={guardarNuevoLink}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--border-color)] hover:border-[var(--verde)] hover:text-[var(--verde)]"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}

