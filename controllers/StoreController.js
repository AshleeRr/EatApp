import {
  StoreRepository,
  CategoryRepository,
  ProductsRepository,
} from "../repository/index.js";

import { HandControllersAsync } from "../utils/handlers/handlerAsync.js";

export const index = HandControllersAsync(async (req, res) => {
  const userId = req.user.id;

  console.log("userId :>> ", userId);

  const store = await StoreRepository.getStoreByUserId(userId);

  if (!store) {
    return res.status(404).json({
      message: "Comercio no encontrado",
    });
  }

  const pedidos = await StoreRepository.getPedidoByStore(userId);

  return res.render("store/index", {
    title: "Mi comercio",
    user: req.user,
    store,
    hasPedidos: pedidos.length > 0,
    pedidos,
  });
});

export const CategoryIndex = HandControllersAsync(async (req, res) => {
  const userId = req.user.id;
  const store = await StoreRepository.getStoreByUserId(userId);

  if (!store) {
    return res.status(404).json({
      message: "Comercio no encontrado",
    });
  }

  const CategoriesAndProducts =
    await CategoryRepository.getCategoriesWithMostProducts(store.id);

  return res.render("storeViews/categories/index", {
    title: "Categorías",
    user: req.user,
    store,
    categories: CategoriesAndProducts,
  });
});

export const createCategoryForm = HandControllersAsync(async (req, res) => {
  const userId = req.user.id;
  const store = await StoreRepository.getStoreByUserId(userId);

  if (!store) {
    return res.status(404).json({
      message: "Comercio no encontrado",
    });
  }

  return res.render("storeViews/categories/create", {
    title: "Crear Categoría",
    user: req.user,
    store,
  });
});

export const createCategory = HandControllersAsync(async (req, res) => {
  const userId = req.user.id;
  const store = await StoreRepository.getStoreByUserId(userId);

  if (!store) {
    return res.status(404).json({
      message: "Comercio no encontrado",
    });
  }

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

  if (!store) {
    return res.status(404).json({
      message: "Comercio no encontrado",
    });
  }

  const categoryId = req.params.id;
  const category = await CategoryRepository.getCategoryById(categoryId);

  if (!category) {
    return res.status(404).json({
      message: "Categoría no encontrada",
    });
  }

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

  if (!store) {
    return res.status(404).json({
      message: "Comercio no encontrado",
    });
  }

  const categoryId = req.params.id;
  const category = await CategoryRepository.getCategoryById(categoryId);
  if (!category) {
    return res.status(404).json({
      message: "Categoría no encontrada",
    });
  }

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
  if (!store) {
    return res.status(404).json({
      message: "Comercio no encontrado",
    });
  }

  const categoryId = req.params.id;
  const category = await CategoryRepository.getCategoryById(categoryId);
  if (!category) {
    return res.status(404).json({
      message: "Categoría no encontrada",
    });
  }

  await CategoryRepository.deleteCategory(categoryId);

  return res.redirect("/storeViews/categories/index");
});
