import { StoreRepository } from "../../repositories/index.js";

import STORE from "../../repositories/stores/index.js";
import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";
import { HandError } from "../../utils/handlers/handlerError.js";

export const index = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "store") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }

  const store = await STORE.StoreRepository.getStoreByUserId(user.id);

  if (!store) HandError(404, "Comercio no encontrado");

  const categories = await STORE.CategoryRepository.getCategoriesByCommerce(
    store.id
  );
  const categorias = categories.map((cat) => cat.dataValues);

  return res.render("storeViews/categories/index", {
    title: "Categories",
    user: req.user,
    store,
    hasCategories: categorias.length > 0,
    categories: categorias,
  });
});

export const createCategoryForm = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "store") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }

  const store = await STORE.StoreRepository.getStoreByUserId(user.id);

  if (!store) HandError(404, "Comercio no encontrado");

  return res.render("storeViews/categories/create", {
    title: "Create a new category",
    user: req.user,
    store,
  });
});

export const createCategory = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "store") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }

  const store = await STORE.StoreRepository.getStoreByUserId(user.id);
  if (!store) HandError(404, "Comercio no encontrado");
  const { name, description } = req.body;
  await STORE.CategoryRepository.createCategory({
    nombre: name,
    descripcion: description,
    comercioId: store.id,
  });

  req.flash("success", "A new category has been created!!");

  return res.redirect("/store/category/index");
});

export const editCategoryForm = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "store") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }

  const store = await STORE.StoreRepository.getStoreByUserId(user.id);
  if (!store) HandError(404, "Comercio no encontrado");
  const categoryId = req.params.id;
  const category = await STORE.CategoryRepository.findById(categoryId);
  const categorias = category.dataValues;
  if (!category) HandError(404, "Categoria no encontrado");

  return res.render("storeViews/categories/create", {
    title: "Edit a category",
    user: user,
    isEditing: true,
    store,
    categorias,
  });
});

export const editCategory = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "store") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }

  const store = await STORE.StoreRepository.getStoreByUserId(user.id);
  if (!store) HandError(404, "Comercio no encontrado");
  const categoryId = req.params.id;
  const category = await STORE.CategoryRepository.findById(categoryId);
  if (!category) HandError(404, "Categoria no encontrado");

  const { name, description } = req.body;
  await STORE.CategoryRepository.updateCategory(categoryId, {
    nombre: name,
    descripcion: description,
  });
  req.flash("success", "A category has been edited!!");
  return res.redirect("/store/category/index");
});

export const deleteCategory = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "store") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }

  const store = await STORE.StoreRepository.getStoreByUserId(user.id);
  if (!store) HandError(404, "Comercio no encontrado");
  const categoryId = req.body.id;
  const category = await STORE.CategoryRepository.findById(categoryId);
  if (!category) HandError(404, "Categoria no encontrado");

  await STORE.CategoryRepository.delete(categoryId);

  req.flash("success", "A new category has been deleted!!");

  return res.redirect("/store/category/index");
});
