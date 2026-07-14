"use client";

import { useEffect, useState } from "react"; // Estado y efecto
import { useRouter, usePathname } from "next/navigation"; // Enrutado
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [usuario, setUsuario] = useState(null); // Estado para manejar el Usuario
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function obtenerUsuario() { //Función asíncrona para obtener el token
      setLoading(true);

      const token = localStorage.getItem("access");

      if (!token) {
        setUsuario(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/usuarios/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          setUsuario(null);
          return;
        }

        const data = await res.json();
        setUsuario(data); // Actualizamos el estado del Usuario
      } catch (error) {
        setUsuario(null);
      } finally {
        setLoading(false);
      }
    }

    obtenerUsuario(); // Ejecutamos la funcion
  }, [pathname]);

  // pathname permite que si la ruta cambia, vuelva a consultar si hay un usuario logeado

  function handleLogout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUsuario(null);
    router.push("/login");
  }

  return (
    <header className="w-full bg-gradient-to-r from-[var(--background)] via-[var(--background)] to-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        <Link href="/" className="text-2xl font-bold text-[var(--texto)]">
          OrganizaDevs
        </Link>

        <nav className="flex items-center gap-8">
          <Link href="/" className="text-[var(--texto)] hover:text-[var(--gris)] transition">
            Home
          </Link>

          <Link href="/dashboard" className="text-[var(--texto)] hover:text-[var(--gris)] transition">
            Proyectos
          </Link>

          <Link href="/#resenas" className="text-[var(--texto)] hover:text-[var(--gris)] transition">
            Reseñas
          </Link>
        </nav>

        {!loading && !usuario && (
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[var(--texto)] hover:text-[var(--gris)] transition">
              Login
            </Link>

            <Link href="/register" className="rounded-full bg-[var(--verde)] px-5 py-2 font-semibold text-[var(--background)] hover:opacity-90 transition">
              Registrarse
            </Link>
          </div>
        )}

        {!loading && usuario && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--gris)]">
              Bienvenido/a,{" "}
              <span className="font-semibold text-[var(--texto)]">
                {usuario.first_name || usuario.username}
              </span>
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="cursor-pointer rounded-lg border border-[var(--border-color)] px-4 py-2 text-sm font-semibold text-[var(--texto)] transition hover:border-[var(--rojo)] hover:text-[var(--rojo)]"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
