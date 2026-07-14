export default function HomePage() {
  return (
    <section className="min-h-[80vh] bg-gradient-to-r from-[var(--background)] via-[var(--background)] to-black px-8 py-20">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-5xl font-bold">OrganizaDevs</h1>

        <p className="mt-4 max-w-xl text-[var(--gris)]">
          Organizá los links importantes de tus proyectos académicos en un solo lugar.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--background)] p-6 transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center text-2xl">
              🔗
            </div>

            <h2 className="text-xl font-semibold text-[var(--texto)]">
              Centralizá tus links
            </h2>

            <p className="mt-3 text-[var(--gris)]">
              Guardá enlaces de GitHub, Drive, Docs, Jira, Trello, Swagger y deploys en un solo lugar.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--background)] p-6 transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center text-2xl">
              👥
            </div>

            <h2 className="text-xl font-semibold text-[var(--texto)]">
              Trabajá en equipo
            </h2>

            <p className="mt-3 text-[var(--gris)]">
              Agregá compañeros a tus proyectos para que todos puedan consultar, agregar o editar recursos.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--background)] p-6 transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center text-2xl">
              🚀
            </div>

            <h2 className="text-xl font-semibold text-[var(--texto)]">
              Evitá perder información
            </h2>

            <p className="mt-3 text-[var(--gris)]">
              Dejá de buscar links perdidos en WhatsApp y mantené cada recurso ordenado por proyecto.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}