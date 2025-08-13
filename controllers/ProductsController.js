import { ProductsRepository, StoreRepository } from "../repository/index.js";

import { HandControllersAsync } from "../utils/handlers/handlerAsync.js";

export const index = HandControllersAsync(async (req, res) => {
  const userId = req.user.id;
  const store = await StoreRepository.getStoreByUserId(userId);

  if (!store) HandError(404, "Comercio no encontrado");

  const products = await ProductsRepository.getProductsByStore(store.id);

  return res.render("storeViews/products/index", {
    title: "My Products",
    user: req.user,
    store,
    hasProducts: products.length > 0,
    products,
  });
});

export const createProductForm = HandControllersAsync(async (req, res) => {
  const userId = req.user.id;
  const store = await ProductsRepository.getStoreByUserId(userId);

  if (!store) HandError(404, "Comercio no encontrado");

  return res.render("storeViews/categories/create", {
    title: "Crear Categoría",
    user: req.user,
    store,
  });
});

export const createProduct = HandControllersAsync(async (req, res) => {
  const userId = req.user.id;
  const store = await ProductsRepository.getStoreByUserId(userId);

  if (!store) HandError(404, "Comercio no encontrado");

  const { name, description } = req.body;
  await CategoryRepository.createCategory({
    name,
    description,
    comercioId: store.id,
  });

  return res.redirect("/storeViews/categories/index");
});

export const editProductForm = HandControllersAsync(async (req, res) => {
  const userId = req.user.id;
  const store = await ProductsRepository.getStoreByUserId(userId);

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

export const editProduct = HandControllersAsync(async (req, res) => {
  const userId = req.user.id;
  const store = await ProductsRepository.getStoreByUserId(userId);

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

export const deleteProduct = HandControllersAsync(async (req, res) => {
  const userId = req.user.id;
  const store = await ProductsRepository.getStoreByUserId(userId);
  if (!store) HandError(404, "Comercio no encontrado");

  const categoryId = req.params.id;
  const category = await CategoryRepository.getCategoryById(categoryId);
  if (!category) HandError(404, "Categoria no encontrado");

  await CategoryRepository.deleteCategory(categoryId);

  return res.redirect("/storeViews/categories/index");
});
