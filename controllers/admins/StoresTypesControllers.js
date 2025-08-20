//repositories
import admin from "../../repositories/admin/index.js";
import { StoreRepository } from "../../repositories/index.js";
//handlers
import { HandError } from "../../utils/handlers/handlerError.js";
import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";

//services
import { saveIMG } from "../../services/imgSaver.js";

export const index = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  const data = await admin.storesTypesRepository.findAll();

  const stores = await StoreRepository.StoreRepository.findAll();

  const storeTypes = data.map((store) => store.dataValues);

  const store = storeTypes.map((type) => {
    const count = stores.filter(
      (store) => store.tipoComercioId === type.id
    ).length;

    return {
      ...type,
      count,
    };
  });

  return res.render("adminViews/storesTypes/index", {
    title: "Store types managment",
    user: user,
    store,
    hasStoresTypes: store.length > 0,
  });
});

export const createForm = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  return res.render("adminViews/storesTypes/create", {
    title: "Create a Store Type",
    user: user,
  });
});

export const create = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  const { name, description } = req.body;
  const logo = req.file;

  const icono = await saveIMG(logo);

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

  return res.redirect("/admin/storesTypes/home");
});

export const editForm = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  const { id } = req.params;

  const data = await admin.storesTypesRepository.findById(id);

  const type = data.dataValues;

  if (!type) HandError(404, "Tipo de comercio no encontrado");

  return res.render("adminViews/storesTypes/create", {
    title: "Editing a Store Type",
    isEditing: true,
    user: user,
    type,
  });
});

export const edit = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  const { id } = req.params;
  const { name, description } = req.body;
  const logo = req.file;

  console.log("id :>> ", id);
  console.log("name :>> ", name);
  console.log("description :>> ", description);
  console.log("logo :>> ", logo);
  const icono = await saveIMG(logo);

  const edited = await admin.storesTypesRepository.update(id, {
    nombre: name,
    descripcion: description,
    icono,
  });
  console.log("edited :>> ", edited);

  if (!edited) HandError(500, "Error al editar el tipo de comercio");

  req.flash("success", "A new store type has been edited!!");

  return res.redirect("/admin/storesTypes/home");
});

export const deleteA = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  const { id } = req.params;

  const store = await admin.storesTypesRepository.findById(id);

  if (!store) HandError(404, "Tipo de comercio no encontrado");

  await admin.storesTypesRepository.delete(id);

  req.flash("success", "The store type has been deleted!!");

  return res.redirect("/admin/storesTypes/home");
});
