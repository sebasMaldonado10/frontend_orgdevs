"use client";

import { useState } from "react"; // Estados
import { useRouter } from "next/navigation"; // Para enrutado
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Para manejar campos del register
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  // Para manejar errores y cargas
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Creamos un 
  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (password !== password2) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    // Hacemos la peticion a la API
    try {
      const res = await fetch(`${API_URL}/api/usuarios/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          first_name: firstName,
          last_name: lastName,
          telefono,
          password,
        }),
      });

      if (!res.ok) {
        throw new Error("No se pudo registrar el usuario");
      }

      router.push("/login"); // Si esta todo bien, me redirigue al login
    } catch (error) {
      setError(error.message); // Guarda los errores
    } finally {
      setLoading(false); // Termina la carga
    }
  }

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-gradient-to-r from-[var(--background)] via-[var(--background)] to-black px-8 py-20">
      <div className="w-full max-w-2xl rounded-2xl border border-[var(--border-color)] bg-[var(--background)] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[var(--texto)]">
            Crear cuenta
          </h1>

          <p className="mt-2 text-sm text-[var(--gris)]">
            Registrate para empezar a organizar tus proyectos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label>
                Usuario
              </label>

              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
                className="w-full rounded-lg border border-[var(--border-color)] bg-transparent px-4 py-3 text-[var(--texto)] outline-none placeholder:text-[var(--gris)] focus:border-[var(--verde)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--texto)]">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresá tu email"
                required
                className="w-full rounded-lg border border-[var(--border-color)] bg-transparent px-4 py-3 text-[var(--texto)] outline-none placeholder:text-[var(--gris)] focus:border-[var(--verde)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--texto)]">
                Nombre
              </label>

              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ingresá tu nombre"
                className="w-full rounded-lg border border-[var(--border-color)] bg-transparent px-4 py-3 text-[var(--texto)] outline-none placeholder:text-[var(--gris)] focus:border-[var(--verde)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--texto)]">
                Apellido
              </label>

              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ingresá tu apellido"
                className="w-full rounded-lg border border-[var(--border-color)] bg-transparent px-4 py-3 text-[var(--texto)] outline-none placeholder:text-[var(--gris)] focus:border-[var(--verde)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--texto)]">
                Teléfono
              </label>

              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ingresá tu teléfono"
                className="w-full rounded-lg border border-[var(--border-color)] bg-transparent px-4 py-3 text-[var(--texto)] outline-none placeholder:text-[var(--gris)] focus:border-[var(--verde)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--texto)]">
                Contraseña
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresá tu contraseña"
                required
                className="w-full rounded-lg border border-[var(--border-color)] bg-transparent px-4 py-3 text-[var(--texto)] outline-none placeholder:text-[var(--gris)] focus:border-[var(--verde)]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[var(--texto)]">
                Repetir contraseña
              </label>

              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="Repetí tu contraseña"
                required
                className="w-full rounded-lg border border-[var(--border-color)] bg-transparent px-4 py-3 text-[var(--texto)] outline-none placeholder:text-[var(--gris)] focus:border-[var(--verde)]"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-[var(--rojo)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-lg bg-[var(--verde)] px-4 py-3 text-lg font-semibold text-[var(--background)] transition duration-300 hover:-translate-y-1 hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--gris)]">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-[var(--verde)] hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </section>
  );
}