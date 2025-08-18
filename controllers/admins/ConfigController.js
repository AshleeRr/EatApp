//repositories
import admin from "../../repositories/admin/index.js";

//handlers
import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";
import { HandError } from "../../utils/handlers/handlerError.js";

export const index = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  const data = await admin.configRepository.getItbis();
  const ITBIS = data.dataValues;

  res.render("adminViews/configs/index", {
    title: "Admin itbis config",
    ITBIS,
  });
});

export const editForm = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }

  const data = await admin.configRepository.getItbis();
  const ITBIS = data.dataValues;

  res.render("adminViews/configs/edit", {
    title: "Editing admin itbis config",
    ITBIS,
  });
});

export const changeItbis = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  const { id, value } = req.body;

  const itbis = parseFloat(value) / 100;

  const ITBIS = await admin.configRepository.update(id, {
    key: "ITBIS",
    value: itbis,
  });

  if (!ITBIS) {
    return req.flash("errors", "Hubo un error tratando de actualizar el dato");
  }

  req.flash("success", "El dato se ha actualizado correctamente");

  res.redirect("/admin/configurations/itbis/home");
});
