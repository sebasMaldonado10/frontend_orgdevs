import Link from "next/link";
import { FaLinkedin, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t bg-gradient-to-r from-[var(--background)] via-[var(--background)] to-black px-4 py-10 md:px-16 lg:px-28">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        
        <div>
          <h2 className="mb-4 text-lg font-bold">
            Acerca de
          </h2>
          <p className="text-[var(--gris)]">
            Un espacio simple para que tu equipo tenga siempre a mano los recursos importantes del proyecto.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-bold">
            Links
          </h2>

          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-[var(--gris)] hover:text-[var(--verde)] transition">
                Home
              </Link>
            </li>

            <li>
              <Link href="/dashboard" className="text-[var(--gris)] hover:text-[var(--verde)] transition">
                Proyectos
              </Link>
            </li>

            <li>
              <Link href="/login" className="text-[var(--gris)] hover:text-[var(--verde)] transition">
                Login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-bold">
            Contacto
          </h2>

          <ul className="space-y-2">

            <li>
              <a
                href="https://wa.me/5493585144550"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--gris)] hover:text-[var(--verde)] transition"
              >
                <FaWhatsapp />
                WhatsApp
              </a>
            </li>

            <li>
              <a
                href="https://www.linkedin.com/in/sebastian-maldonado-8a462b32a/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--gris)] hover:text-[var(--verde)] transition"
              >
                <FaLinkedin />
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-[var(--border-color)] pt-4">
        <p className="text-center text-sm text-[var(--gris)]">
          © 2026 OrganizaDevs. Desarrollado por{" "}
          <span className="font-semibold text-[var(--texto)]">
            Sebastián Maldonado
          </span>
        </p>
      </div>
    </footer>
  );
}