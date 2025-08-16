import { StoreRepository } from "../../repositories/index.js";

import STORE from "../../repositories/stores/index.js";
import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";
import { HandError } from "../../utils/handlers/handlerError.js";

export const index = HandControllersAsync(async (req, res) => {
  const userId = req.session.user.id;
  const store = await STORE.StoreRepository.getStoreByUserId(userId);

  if (!store) HandError(404, "Comercio no encontrado");

  const CategoriesAndProducts =
    await STORE.CategoryRepository.getCategoriesByCommerceWithProducts(
      store.id
    );

  return res.render("storeViews/categories/index", {
    title: "Categories",
    user: req.user,
    store,
    hasCategories: CategoriesAndProducts.length > 0,
    categories: CategoriesAndProducts,
  });
});

export const createCategoryForm = HandControllersAsync(async (req, res) => {
  const userId = req.session.user.id;
  const store = await STORE.StoreRepository.getStoreByUserId(userId);

  if (!store) HandError(404, "Comercio no encontrado");

  return res.render("storeViews/categories/create", {
    title: "Create a new category",
    user: req.user,
    store,
  });
});

export const createCategory = HandControllersAsync(async (req, res) => {
  const userId = req.session.user.id;
  const store = await STORE.StoreRepository.getStoreByUserId(userId);

  if (!store) HandError(404, "Comercio no encontrado");

  const { name, description } = req.body;
  await STORE.CategoryRepository.createCategory({
    name,
    description,
    comercioId: store.id,
  });

  req.flash("success", "A new category has been created!!");

  return res.redirect("/storeViews/categories/index");
});

export const editCategoryForm = HandControllersAsync(async (req, res) => {
  const userId = req.session.user.id;
  const store = await STORE.StoreRepository.getStoreByUserId(userId);

  if (!store) HandError(404, "Comercio no encontrado");

  const categoryId = req.params.id;
  const category = await STORE.CategoryRepository.getCategoryById(categoryId);

  if (!category) HandError(404, "Categoria no encontrado");

  return res.render("store/categories/create", {
    title: "Edit a category",
    user: req.user,
    isEditing: true,
    store,
    category,
  });
});

export const editCategory = HandControllersAsync(async (req, res) => {
  const userId = req.session.user.id;
  const store = await STORE.StoreRepository.getStoreByUserId(userId);

  if (!store) HandError(404, "Comercio no encontrado");

  const categoryId = req.params.id;
  const category = await STORE.CategoryRepository.getCategoryById(categoryId);
  if (!category) HandError(404, "Categoria no encontrado");

  const { name, description } = req.body;
  await STORE.CategoryRepository.updateCategory(categoryId, {
    name,
    description,
  });
  req.flash("success", "A category has been edited!!");
  return res.redirect("/storeViews/categories/index");
});

export const deleteCategory = HandControllersAsync(async (req, res) => {
  const userId = req.session.user.id;
  const store = await STORE.StoreRepository.getStoreByUserId(userId);
  if (!store) HandError(404, "Comercio no encontrado");

  const categoryId = req.params.id;
  const category = await STORE.CategoryRepository.getCategoryById(categoryId);
  if (!category) HandError(404, "Categoria no encontrado");

  await STORE.CategoryRepository.delete(categoryId);

  req.flash("success", "A new category has been deleted!!");

  return res.redirect("/storeViews/categories/index");
});
