import Link from "next/link";
import { FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t bg-gradient-to-r from-[var(--background)] via-[var(--background)] to-black px-4 py-10 md:px-16 lg:px-28">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        
        <div>
          <h2 className="mb-4 text-lg font-bold">
            About Us
          </h2>
          <p className="text-[var(--gris)]">
            Organizá los links de tus proyectos académicos en un solo lugar.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-bold">
            Quick Links
          </h2>

          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-[var(--gris)] hover:text-[var(--verde)] transition">
                Home
              </Link>
            </li>

            <li>
              <Link href="/#guia" className="text-[var(--gris)] hover:text-[var(--verde)] transition">
                Guía
              </Link>
            </li>

            <li>
              <Link href="/#resenas" className="text-[var(--gris)] hover:text-[var(--verde)] transition">
                Reseñas
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
            Follow
          </h2>

          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="flex items-center gap-2 text-[var(--gris)] hover:text-[var(--verde)] transition"
              >
                <FaInstagram />
                Instagram
              </a>
            </li>

            <li>
              <a
                href="#"
                className="flex items-center gap-2 text-[var(--gris)] hover:text-[var(--verde)] transition"
              >
                <FaWhatsapp />
                WhatsApp
              </a>
            </li>

            <li>
              <a
                href="#"
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
          © 2026 OrganizaDevs
        </p>
      </div>
    </footer>
  );
}