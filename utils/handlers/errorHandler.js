export const HandError = (titulo, status) => {
  const error = new Error(titulo);
  error.status = status;
  throw error;
};

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Error del servidor";

  res.status(status).json({
    success: false,
    message: `Hubo un ${message} con estatus ${status}`,
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default HandError;
