import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Fuentes
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700"],
  subsets: ['latin'],
})

export const metadata = {
  title: "OrganizaDevs",
  description: "Organiza los links de tus proyectos académicos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={montserrat.className}>
      <body className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--texto)]">
        <Navbar />

        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
