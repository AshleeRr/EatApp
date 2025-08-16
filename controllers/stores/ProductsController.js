import path from "path";

import STORE from "../../repositories/stores/index.js";
import { HandError } from "../../utils/handlers/handlerError.js";
import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";

export const index = HandControllersAsync(async (req, res) => {
  const userId = req.session.user.id;
  const store = await STORE.StoreRepository.getStoreByUserId(userId);

  if (!store) HandError(404, "Comercio no encontrado");

  const products = await STORE.ProductsRepository.getProductsByStore(store.id);

  return res.render("storeViews/product/index", {
    title: "My Products",
    user: req.user,
    store,
    hasProducts: products.length > 0,
    products,
  });
});

export const createProductForm = HandControllersAsync(async (req, res) => {
  const userId = req.session.user.id;
  const store = await STORE.StoreRepository.getStoreByUserId(userId);

  if (!store) HandError(404, "Comercio no encontrado");

  return res.render("storeViews/product/create", {
    title: "Create Product",
    user: req.user,
    store,
  });
});

export const createProduct = HandControllersAsync(async (req, res) => {
  const userId = req.session.user.id;
  const store = await STORE.StoreRepository.getStoreByUserId(userId);

  if (!store) HandError(404, "Comercio no encontrado");

  const { nombre, descripcion, precio, categoria } = req.body;
  const Logo = req.file ? req.file.filename : null;

  if (!nombre || !descripcion || !precio || !categoria || !imagen) {
    HandError(400, "Todos los campos son obligatorios");
  }
  const ImgRoute = "\\" + path.resolve("public", Logo.path);

  const newP = await STORE.ProductsRepository.createProduct({
    nombre,
    descripcion,
    precio,
    ImgRoute,
    comercioId: store.id,
    categoriaId: categoria.id,
  });

  if (!newP) HandError(500, "Error al crear el producto");
  return res.redirect("/storeViews/product/index");
});

export const editProductForm = HandControllersAsync(async (req, res) => {
  const userId = req.session.user.id;
  const store = await STORE.StoreRepository.getStoreByUserId(userId);

  if (!store) HandError(404, "Comercio no encontrado");

  const productId = req.params.id;
  const product = await STORE.ProductsRepository.getProductById(productId);

  if (!product) HandError(404, "Producto no encontrado");

  return res.render("storeViews/product/create", {
    title: "Editar Producto",
    user: req.user,
    store,
    product,
  });
});

export const editProduct = HandControllersAsync(async (req, res) => {
  const userId = req.session.user.id;
  const store = await STORE.StoreRepository.getStoreByUserId(userId);

  if (!store) HandError(404, "Comercio no encontrado");

  const productId = req.params.id;
  const product = await STORE.ProductsRepository.getProductById(productId);

  if (!product) HandError(404, "Producto no encontrado");

  const newP = await STORE.ProductsRepository.updateProduct({
    nombre,
    descripcion,
    precio,
    ImgRoute,
    comercioId: store.id,
    categoriaId: categoria.id,
  });

  if (!newP) HandError(500, "Error al editar el producto");
  return res.redirect("/storeViews/product/index");
});

export const deleteProduct = HandControllersAsync(async (req, res) => {
  const userId = req.session.user.id;
  const store = await STORE.StoreRepository.getStoreByUserId(userId);
  if (!store) HandError(404, "Comercio no encontrado");

  const productId = req.params.id;
  const product = await STORE.ProductsRepository.getProductById(productId);

  if (!product) HandError(404, "Producto no encontrado");

  await STORE.ProductsRepository.deleteProduct(productId);

  return res.redirect("/storeViews/product/index");
});
