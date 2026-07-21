"use client";

// Importamos los componentes
import ProjectInfoCard from "@/components/proyectos/ProjectInfoCard";
import LinkCategoryCard from "@/components/proyectos/LinkCategoryCard";
import ProjectInvitationCard from "@/components/proyectos/ProjectInvitationCard";

import { useEffect, useState } from "react"; // Para manejar estados y efectos secundarios
import { useParams, useRouter } from "next/navigation"; // Para ruta dinámica y enrutado

export default function DetalleProyectoPage() {
  // DECLARAMOS LOS ESTADOS

  const { id } = useParams(); // Obtiene el id del proyecto
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;


  // PARA AGREGAR MIEMBROS USAMOS ESTOS ESTADOS
  const [miembros, setMiembros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  
  // ESTADOS PRINCIPALES
  const [proyecto, setProyecto] = useState(null);
  const [links, setLinks] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("")

  // useEffect para traer datos de la API
  useEffect(() => {
    async function fetchProyecto() {
      const token = localStorage.getItem("access");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const resProyecto = await fetch(
          // Traemos el proyecto por ID
          `${API_URL}/api/proyectos/proyectos/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!resProyecto.ok) {
          throw new Error("No se pudo cargar el proyecto");
        }

        const dataProyecto = await resProyecto.json(); // Pasamos a formato JSON
        setProyecto(dataProyecto); // Actualizamos el estado

        const resLinks = await fetch(
          // Obtenemos los links
          `${API_URL}/api/proyectos/links/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!resLinks.ok) {
          throw new Error("No se pudieron cargar los links");
        }

        const dataLinks = await resLinks.json();

        // Filtra los links
        const linksDelProyecto = dataLinks.filter(
          (link) => Number(link.proyecto) === Number(id)
        );

        setLinks(linksDelProyecto); // Actualizamos el estado

        const resCategorias = await fetch(
          // Trae las categorias/Cards
          `${API_URL}/api/proyectos/categorias/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!resCategorias.ok) {
          throw new Error("No se pudieron cargar las categorías");
        }

        const dataCategorias = await resCategorias.json();
        setCategorias(dataCategorias); // Actualiza el estado

        // Traemos miembros
        const resMiembros = await fetch(
          `${API_URL}/api/proyectos/miembros/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!resMiembros.ok) {
          throw new Error("No se pudieron cargar los miembros");
        }

        const dataMiembros = await resMiembros.json();

        const miembrosDelProyecto = dataMiembros.filter(
          (miembro) => Number(miembro.proyecto) === Number(id)
        );

        setMiembros(miembrosDelProyecto);

        // Traemos usuarios
        const resUsuarios = await fetch(
          `${API_URL}/api/usuarios/usuarios/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!resUsuarios.ok) {
          throw new Error("No se pudieron cargar los usuarios");
        }

        const dataUsuarios = await resUsuarios.json();
        setUsuarios(dataUsuarios);

      } catch (error) { // El catch captura los errores
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProyecto(); // Ejecuta la funcion
  }, [id, router]);


  function normalizarUrl(url) {
  const urlLimpia = url.trim();

  if (urlLimpia.startsWith("http://") || urlLimpia.startsWith("https://")) {
    return urlLimpia;
  }

  return `https://${urlLimpia}`;
  }


  // Esta funcion hace un POST para crear nuevos links
  async function handleCrearLink(categoriaId, urlLink) {
    const token = localStorage.getItem("access"); // Obtenemos el Token

    if (!token) {
      router.push("/login");
      return false;
    }

    const urlNormalizada = normalizarUrl(urlLink);

    try {
      const linksDeLaCategoria = links.filter(
        (link) => Number(link.categoria) === Number(categoriaId)
      );

      const res = await fetch(`${API_URL}/api/proyectos/links/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          proyecto: Number(id),
          titulo: `Link ${linksDeLaCategoria.length + 1}`,
          url: urlNormalizada,
          descripcion: "",
          categoria: Number(categoriaId),
        }),
      });

      if (!res.ok) {
        throw new Error("No se pudo crear el link");
      }

      const nuevoLink = await res.json();

      setLinks([...links, nuevoLink]); // Actualiza el estado

      return true;
    } catch (error) {
      setFormError(error.message);
      return false;
    }
  }

  // Esta funcion hace un PATCH para editar un link existente
  async function handleEditarLink(linkId, nuevaUrl) {
    const token = localStorage.getItem("access");

    if (!token) {
      router.push("/login");
      return false;
    }

    const urlNormalizada = normalizarUrl(nuevaUrl);

    try {
      const res = await fetch(
        `${API_URL}api/proyectos/links/${linkId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            url: urlNormalizada,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("No se pudo editar el link");
      }

      const linkEditado = await res.json();

      setLinks(
        links.map((link) =>
          link.id === linkId ? linkEditado : link
        )
      );

      return true;
    } catch (error) {
      setFormError(error.message);
      return false;
    }
  }

  // Esta función hace un DELETE para eliminar un link
  async function handleEliminarLink(linkId) {
    const confirmar = confirm("¿Seguro que querés eliminar este link?");

    if (!confirmar) {
      return;
    }

    const token = localStorage.getItem("access");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/proyectos/links/${linkId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("No se pudo eliminar el link");
      }

      setLinks(links.filter((link) => link.id !== linkId));
    } catch (error) {
      setFormError(error.message);
    }
  }
  

  if (loading) {
    return <p className="p-8">Cargando proyecto...</p>;
  }

  if (error) {
    return <p className="p-8 text-[var(--rojo)]">{error}</p>;
  }

  // Esta funcion relaciona los links con las categorias

  const categoriasConLinks = categorias.map((categoria) => ({
    ...categoria,
    links: links.filter(
      (link) => Number(link.categoria) === Number(categoria.id)
    ),
  }));

  // categoría GitHub con sus links adentro
  // categoría Jira con sus links adentro
  // categoría Docs con sus links adentro

  return (
    <section className="min-h-[80vh] bg-gradient-to-r from-[var(--background)] via-[var(--background)] to-black px-8 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            />
          ))}
        </div>
      </div>
    </section>
  )};