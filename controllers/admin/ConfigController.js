//repositories
import admin from "../../repositories/admin/index.js";

//handlers
import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";
import { HandError } from "../../utils/handlers/handlerError.js";

export const index = HandControllersAsync(async (req, res) => {
  const { user } = req;

  if (!user) HandError(405, "No tienes permisos para entrar a esta ruta");

  const itbis = await admin.configRepository.getItbis();

  console.log("itbis :>> ", itbis);

  res.render("adminViews/configs/index", {
    title: "Admin itbis config",
    itbis,
  });
});

export const changeItbis = HandControllersAsync(async (req, res) => {
  const { user } = req;

  if (!user) HandError(405, "No tienes permisos para entrar a esta ruta");

  const { itbis } = req.body;

  await admin.configRepository.update(itbis.id, itbis);

  req.flash("success", "El dato se ha actualizado correctamente");

  res.redirect("/admin/itbis/home");
});
