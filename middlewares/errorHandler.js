const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Error del servidor";

  console.error(`Error ${status}: ${message}`);
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  if (req.flash) {
    req.flash("errors", `Hubo un error: ${message}`);
  }

  if (!res.headersSent) {
    return res.redirect("back") || res.redirect("/");
  }
};

export default errorHandler;
