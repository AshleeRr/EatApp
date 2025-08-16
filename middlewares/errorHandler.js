const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Error del servidor";

  if (req.xhr || req.headers.accept?.includes("application/json")) {
    return res.status(status).json({
      success: false,
      message: `Hubo un error: ${message}`,
      status: status,
      error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  req.flash("errors", `Hubo un error: ${message}`);

  // return res.status(status).render("error", {
  //   message,
  //   status,
  //   error: process.env.NODE_ENV === "development" ? err : undefined,
  // });
};

export default errorHandler;
