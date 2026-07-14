export default function LinkForm({
  linkEditandoId,
  tituloLink,
  setTituloLink,
  urlLink,
  setUrlLink,
  formError,
  handleCrearLink,
  handleEditarLink,
  cancelarFormulario,
}) {
  return (
    <form
      onSubmit={linkEditandoId ? handleEditarLink : handleCrearLink}
      className="mt-10 rounded-3xl border border-[var(--border-color)] bg-[var(--background)] p-6 text-[var(--texto)]"
    >
      <h2 className="text-2xl font-bold">
        {linkEditandoId ? "Editar link" : "Agregar link"}
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <input
          type="text"
          value={tituloLink}
          onChange={(e) => setTituloLink(e.target.value)}
          placeholder="Título del link"
          required
          className="rounded-lg border border-[var(--border-color)] bg-transparent px-4 py-3 outline-none placeholder:text-[var(--gris)] focus:border-[var(--verde)]"
        />

        <input
          type="url"
          value={urlLink}
          onChange={(e) => setUrlLink(e.target.value)}
          placeholder="URL del link"
          required
          className="rounded-lg border border-[var(--border-color)] bg-transparent px-4 py-3 outline-none placeholder:text-[var(--gris)] focus:border-[var(--verde)]"
        />
      </div>

      {formError && (
        <p className="mt-4 text-sm text-[var(--rojo)]">
          {formError}
        </p>
      )}

      <div className="mt-6 flex gap-4">
        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-[var(--verde)] px-5 py-3 font-semibold text-[var(--background)] transition hover:opacity-75"
        >
          {linkEditandoId ? "Guardar cambios" : "Guardar link"}
        </button>

        <button
          type="button"
          onClick={cancelarFormulario}
          className="cursor-pointer rounded-lg border border-[var(--border-color)] px-5 py-3 font-semibold transition hover:bg-[var(--rojo)]"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}