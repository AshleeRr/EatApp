export function formatDate(dateString) {
  const date = new Date(dateString);

  // Opciones de formato (sin segundos)
  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
