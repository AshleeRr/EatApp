const formatear = (fecha) => {
  const datee = new Date(fecha);

  const opciones = {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const formato = datee.toLocaleString("es-ES", opciones);
  return formato.replace(",", " •");
};

export default formatear;
