import { CategoryRepository, StoreRepository } from "../repositories/index.js";

import { HandControllersAsync } from "../utils/handlers/handlerAsync.js";

export const index = HandControllersAsync(async (req, res) => {
  const userId = req.user.id;
  const store = await StoreRepository.getStoreByUserId(userId);

  if (!store) HandError(404, "Comercio no encontrado");

  const CategoriesAndProducts =
    await CategoryRepository.getCategoriesWithMostProducts(store.id);

  return res.render("storeViews/categories/index", {
    title: "Categorías",
    user: req.user,
    store,
    hasCategories: CategoriesAndProducts.length > 0,
    categories: CategoriesAndProducts,
  });
});

export const createCategoryForm = HandControllersAsync(async (req, res) => {
  const userId = req.user.id;
  const store = await StoreRepository.getStoreByUserId(userId);

  if (!store) HandError(404, "Comercio no encontrado");

  return res.render("storeViews/categories/create", {
    title: "Crear Categoría",
    user: req.user,
    store,
  });
});

export const createCategory = HandControllersAsync(async (req, res) => {
  const userId = req.user.id;
  const store = await StoreRepository.getStoreByUserId(userId);

  if (!store) HandError(404, "Comercio no encontrado");

  const { name, description } = req.body;
  await CategoryRepository.createCategory({
    name,
    description,
    comercioId: store.id,
  });

  return res.redirect("/storeViews/categories/index");
});

export const editCategoryForm = HandControllersAsync(async (req, res) => {
  const userId = req.user.id;
  const store = await StoreRepository.getStoreByUserId(userId);

  if (!store) HandError(404, "Comercio no encontrado");

  const categoryId = req.params.id;
  const category = await CategoryRepository.getCategoryById(categoryId);

  if (!category) HandError(404, "Categoria no encontrado");

  return res.render("store/catgories/create", {
    title: "Editar Categoría",
    user: req.user,
    store,
    category,
  });
});

export const editCategory = HandControllersAsync(async (req, res) => {
  const userId = req.user.id;
  const store = await StoreRepository.getStoreByUserId(userId);

  if (!store) HandError(404, "Comercio no encontrado");

  const categoryId = req.params.id;
  const category = await CategoryRepository.getCategoryById(categoryId);
  if (!category) HandError(404, "Categoria no encontrado");

  const { name, description } = req.body;
  await CategoryRepository.updateCategory(categoryId, {
    name,
    description,
  });

  return res.redirect("/storeViews/categories/index");
});

export const deleteCategory = HandControllersAsync(async (req, res) => {
  const userId = req.user.id;
  const store = await StoreRepository.getStoreByUserId(userId);
  if (!store) HandError(404, "Comercio no encontrado");

  const categoryId = req.params.id;
  const category = await CategoryRepository.getCategoryById(categoryId);
  if (!category) HandError(404, "Categoria no encontrado");

  await CategoryRepository.deleteCategory(categoryId);

  return res.redirect("/storeViews/categories/index");
});
