//repositories
import admin from "../../repositories/admin/index.js";
//handlers
import { HandError } from "../../utils/handlers/handlerError.js";
import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";

//services
import { saveIMG } from "../../services/imgSaver.js";

export const index = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  console.log("user :>> ", user);
  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  const storeTypes = admin.storesTypesRepository.findAll();

  return res.render("storeViews/storesTypes/index", {
    title: "Store types managment",
    user: user,
    storeTypes,
    hasStoresTypes: storeTypes.leght > 0,
  });
});

export const createForm = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  console.log("user :>> ", user);
  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  return res.render("storeViews/storesTypes/create", {
    title: "Create a Store Type",
    user: user,
  });
});

export const create = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  console.log("user :>> ", user);
  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  const { name, description } = req.body;
  const { logo } = req.file;

  const icono = saveIMG(logo.path);

  const newType = await admin.storesTypesRepository.create({
    nombre: name,
    descripcion: description,
    icono: icono,
  });

  if (!newType)
    HandError(
      500,
      "Error al crear el nuevo tipo de comercio, intenta de nuevo"
    );
  req.flash("success", "A new store type has been created!!");

  return res.redirect("/storesTypes/home");
});

export const editForm = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  console.log("user :>> ", user);
  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  const idTypeype = req.params.id;
  const type = await admin.storesTypesRepository.findOne(idType);

  if (!type) HandError(404, "Tipo de comercio no encontrado");

  return res.render("storeViews/storesTypes/create", {
    title: "Editing a Store Type",
    isEditing: true,
    user: user,
    type,
  });
});

export const edit = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  console.log("user :>> ", user);
  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  const { nombre, descripcion } = req.body;
  const { logo } = req.file;

  const icono = saveIMG(logo.path);

  const edited = await admin.storesTypesRepository.update({
    nombre,
    descripcion,
    icono,
  });

  if (!edited) HandError(500, "Error al editar el tipo de comercio");

  req.flash("success", "A new store type has been edited!!");

  return res.redirect("/storesTypes/home");
});

export const deleteA = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  console.log("user :>> ", user);
  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  const storeId = req.params.id;
  const store = await admin.userRepository.findOne(storeId);

  if (!store) HandError(404, "Tipo de comercio no encontrado");

  await admin.adminRepository.delete(store);

  req.flash("success", "A new store type has been deleted!!");

  return res.redirect("/storesTypes/home");
});
