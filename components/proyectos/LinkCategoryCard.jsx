"use client";

import { useState } from "react";
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
  const [nuevoLink, setNuevoLink] = useState("");
  const [linksEditados, setLinksEditados] = useState({});

  function obtenerValorLink(link) {
    return linksEditados[link.id] ?? link.url ?? "";
  }

  function obtenerHref(link) {
    const valor = obtenerValorLink(link).trim();

    if (!valor) return "#";

    if (valor.startsWith("http://") || valor.startsWith("https://")) {
      return valor;
    }

    return `https://${valor}`;
  }

  async function guardarNuevoLink() {
    if (!nuevoLink.trim()) return;

    const creado = await handleCrearLink(categoria.id, nuevoLink);

    if (creado) {
      setNuevoLink("");
    }
  }

  async function guardarEdicion(link) {
    const nuevaUrl = linksEditados[link.id];

    if (nuevaUrl === undefined) return;
    if (!nuevaUrl.trim()) return;
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

  return (
    <div className="flex h-[430px] flex-col overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--background)] p-6 text-[var(--texto)] transition-all duration-300 hover:-translate-y-2 hover:border-[var(--border-color)] hover:shadow-xl">
      <h3 className="shrink-0 text-center text-xl font-bold">
        Link de {categoria.nombre}
      </h3>

      <div className="mt-4 shrink-0 border-t-2 border-[var(--border-color)]"></div>

      <div className="flex flex-1 min-h-36 items-center justify-center">
        <Image
          src={obtenerIconoCategoria(categoria.nombre)}
          alt={`Ícono de ${categoria.nombre}`}
          width={125}
          height={125}
          className="rounded-xl object-contain"
        />
      </div>

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
                className="min-w-0 flex-1 border-b border-dashed border-[var(--border-color)] bg-transparent px-2 py-1 text-sm outline-none focus:border-[var(--verde)]"
              />

              <a
                href={obtenerHref(link)}
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir link"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-color)] text-sm font-bold hover:border-[var(--verde)] hover:text-[var(--verde)]"
              >
                ↗
              </a>

              <button
                type="button"
                title="Eliminar link"
                onClick={() => handleEliminarLink(link.id)}
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--border-color)] text-xl font-bold hover:border-[var(--rojo)] hover:text-[var(--rojo)]"
              >
                -
              </button>
            </div>
          ))}
        </div>
      )}

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
          className="min-w-0 flex-1 border-b border-dashed border-[var(--border-color)] bg-transparent px-2 py-1 text-sm outline-none placeholder:text-[var(--gris)] focus:border-[var(--verde)]"
        />

        <button
          type="button"
          title="Agregar link"
          onClick={guardarNuevoLink}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--border-color)] text-xl font-bold hover:border-[var(--verde)] hover:text-[var(--verde)]"
        >
          +
        </button>
      </div>
    </div>
  );
}