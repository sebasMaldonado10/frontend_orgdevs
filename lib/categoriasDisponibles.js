export const categoriasDisponibles = [
  {
    nombre: "GitHub",
    descripcion: "Repositorios de código",
    icono: "GitBranch",
  },
  {
    nombre: "Jira",
    descripcion: "Gestión de tareas",
    icono: "Kanban",
  },
  {
    nombre: "Figma",
    descripcion: "Diseños y prototipos",
    icono: "PenTool",
  },
  {
    nombre: "Docs",
    descripcion: "Documentación del proyecto",
    icono: "FileText",
  },
  {
    nombre: "Base de datos",
    descripcion: "Bases de datos y recursos SQL",
    icono: "Database",
  },
  {
    nombre: "Deploy",
    descripcion: "Despliegues y hosting",
    icono: "CloudUpload",
  },
  {
    nombre: "API",
    descripcion: "Endpoints y servicios",
    icono: "Plug",
  },
  {
    nombre: "Testing",
    descripcion: "Pruebas de software",
    icono: "FlaskConical",
  },
  {
    nombre: "Comunicación",
    descripcion: "Mensajería y reuniones",
    icono: "MessagesSquare",
  },
];

export function obtenerCategoriaVisual(nombre) {
  return categoriasDisponibles.find(
    (categoria) =>
      categoria.nombre.toLowerCase() ===
      nombre.trim().toLowerCase()
  );
}
