"use client"; //Neceitamos interactividad

import { useState } from "react"; // Para manejar los estados
import Image from "next/image";

function obtenerIconoCategoria(nombre) {
  const nombreNormalizado = nombre.toLowerCase();

  if (nombreNormalizado.includes("github")) return "/icons/github.png";
  if (nombreNormalizado.includes("jira")) return "/icons/jira.png";
  if (nombreNormalizado.includes("figma")) return "/icons/figma.png";
  if (nombreNormalizado.includes("doc")) return "/icons/docs.png";

  return "/icons/link.png";
}

export default function LinkCategoryCard({
  categoria,
  handleCrearLink,
  handleEditarLink,
  handleEliminarLink,
}) {
  const [nuevoLink, setNuevoLink] = useState(""); // Estado para controlar un nuevo link
  const [linksEditados, setLinksEditados] = useState({}); // Estado para links editados

  function obtenerValorLink(link) {
    return linksEditados[link.id] ?? link.url ?? "";
  }

  {/* Funcion asincrona para GUARDAR UN LINK */}
  async function guardarNuevoLink() {
    if (!nuevoLink.trim()) return;

    const creado = await handleCrearLink(categoria.id, nuevoLink);

    {/* Si se crea, limpiamos el estado */}
    if (creado) {
      setNuevoLink("");
    }
  }

  {/* Funcion asincrona para EDITAR UN LINK */}
  async function guardarEdicion(link) {
    const nuevaUrl = linksEditados[link.id];

    if (nuevaUrl === undefined) return;
    if (nuevaUrl.trim() === link.url) return;

    const editado = await handleEditarLink(link.id, nuevaUrl);

    if (editado) {
      setLinksEditados((prev) => {
        const copia = { ...prev };
        delete copia[link.id];
        return copia;
      });
    }
  }

  // CARD
  return (
    <div className="flex h-[360px] flex-col rounded-3xl border border-[var(--border-color)] bg-[var(--background)] p-6 text-[var(--texto)]">
      <h3 className="text-center text-xl font-bold">
        Link de {categoria.nombre}
      </h3>

      <div className="mt-4 border-t-2 border-[var(--border-color)]"></div>

      <div className="flex flex-1 items-center justify-center">
        <Image
          src={obtenerIconoCategoria(categoria.nombre)}
          alt={`Ícono de ${categoria.nombre}`}
          width={150}
          height={150}
          className="object-contain rounded-xl"
        />
      </div>

      <div className="mt-auto py-2">
        <div className="max-h-24 space-y-2 overflow-y-auto pr-2">
          {categoria.links.length === 0 ? (
            <p className="text-sm text-[var(--gris)]">
              Pegá un link abajo y tocá +
            </p>
          ) : (
            categoria.links.map((link) => (
              <div
                key={link.id}
                className="flex items-center gap-2"
              >
                <span className="font-semibold">
                  Link:
                </span>

                {/* EDITAR LINK */}
                <input
                  type="url"
                  value={obtenerValorLink(link)}
                  onChange={(e) =>
                    setLinksEditados({
                      ...linksEditados,
                      [link.id]: e.target.value,
                    })
                  }
                  onBlur={() => guardarEdicion(link)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      guardarEdicion(link);
                    }
                  }}
                  className="min-w-0 flex-1 border-b border-dashed border-[var(--border-color)] bg-transparent px-2 py-1 text-sm outline-none focus:border-[var(--verde)]"
                />

                {/* BOTON PARA REDIRIGIR AL LINK*/}
                <a
                  href={obtenerValorLink(link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-color)] text-sm font-bold hover:border-[var(--gris)] hover:text-[var(--texto)]"
                >
                  ↗
                </a>
                
                {/* ELIMINAR LINK */}
                <button
                  type="button"
                  onClick={() => handleEliminarLink(link.id)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[var(--border-color)] text-xl font-bold hover:border-[var(--rojo)] hover:text-[var(--rojo)]"
                >
                  -
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* NUEVOS LINKS */}  
      <div className="flex items-center gap-2">
        <span className="font-semibold">
          Link:
        </span>

        {/* AGREGAMOS UN NUEVO LINK */}  
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
          className="min-w-0 flex-1 border-b border-dashed border-[var(--border-color)] bg-transparent px-2 py-1 text-sm outline-none placeholder:text-[var(--gris)] focus:border-[var(--verde)]"
        />

        {/* BOTON PARA AGREGAR NUEVO LINK */}  
        <button
          type="button"
          onClick={guardarNuevoLink}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[var(--border-color)] text-xl font-bold hover:border-[var(--verde)] hover:text-[var(--verde)]"
        >
          +
        </button>
      </div>
    </div>
  );
}