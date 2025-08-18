import STORE from "../../repositories/stores/index.js";
import { HandError } from "../../utils/handlers/handlerError.js";
import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";

//services
import { saveIMG } from "../../services/imgSaver.js";

export const index = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "store") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }

  const store = await STORE.StoreRepository.getStoreByUserId(user.id);

  const data = await STORE.ProductsRepository.getProductsByStore(store.id);

  const products = data.map((cat) => cat.dataValues);

  return res.render("storeViews/products/index", {
    title: "My Products",
    user: req.user,
    store,
    hasProducts: products.length > 0,
    products: products,
  });
});

export const createProductForm = HandControllersAsync(async (req, res) => {
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

  return res.render("storeViews/products/create", {
    title: "Create Product",
    user: req.user,
    store,
    hasCategories: categorias.length > 0,
    categories: categorias,
  });
});

export const createProduct = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "store") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }

  const store = await STORE.StoreRepository.getStoreByUserId(user.id);

  if (!store) HandError(404, "Comercio no encontrado");

  const { nombre, descripcion, precio, categoria } = req.body;
  const Logo = req.file;

  if (!nombre || !descripcion || !precio || !categoria || !Logo) {
    HandError(400, "Todos los campos son obligatorios");
  }

  const imagen = await saveIMG(Logo);

  const newP = await STORE.ProductsRepository.create({
    nombre,
    descripcion,
    precio,
    imagen,
    comercioId: store.id,
    categoriaId: categoria,
  });

  if (!newP) HandError(500, "Error al crear el producto");
  req.flash("success", "El producto ha sido creado");
  return res.redirect("/store/product/index");
});

export const editProductForm = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "store") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }

  const store = await STORE.StoreRepository.getStoreByUserId(user.id);

  if (!store) HandError(404, "Comercio no encontrado");

  const productId = req.params.id;

  const data = await STORE.ProductsRepository.getProductById(productId);

  const product = data.dataValues;
  if (!product) HandError(404, "Producto no encontrado");

  const categories = await STORE.CategoryRepository.getCategoriesByCommerce(
    store.id
  );
  const categorias = categories.map((cat) => cat.dataValues);
  return res.render("storeViews/products/create", {
    title: "Editar Producto",
    user: req.user,
    store,
    isEditing: true,
    product,
    hasCategories: categorias.length > 0,
    categories: categorias,
  });
});

export const editProduct = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "store") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }

  const store = await STORE.StoreRepository.getStoreByUserId(user.id);

  if (!store) HandError(404, "Comercio no encontrado");

  const productId = req.params.id;
  const product = await STORE.ProductsRepository.getProductById(productId);

  if (!product) HandError(404, "Producto no encontrado");

  const { nombre, descripcion, precio, categoria } = req.body;
  const logo = req.file;

  const imagen = await saveIMG(logo);

  const newP = await STORE.ProductsRepository.update(productId, {
    nombre,
    descripcion,
    precio,
    imagen,
    comercioId: store.id,
    categoriaId: categoria,
  });

  if (!newP) HandError(500, "Error al editar el producto");
  req.flash("success", "El producto ha sido editado");
  return res.redirect("/store/product/index");
});

export const deleteProduct = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "store") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }

  const store = await STORE.StoreRepository.getStoreByUserId(user.id);

  if (!store) HandError(404, "Comercio no encontrado");

  const { id } = req.body;

  const product = await STORE.ProductsRepository.getProductById(id);

  if (!product) HandError(404, "Producto no encontrado");

  await STORE.ProductsRepository.deleteProduct(id);
  req.flash("success", "El producto ha sido eliminado");
  return res.redirect("/store/product/index");
});
