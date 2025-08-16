import { StoreRepository, ClientRepository } from "../../repositories/index.js";
//handlers
import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";
import { HandError } from "../../utils/handlers/handlerError.js";

export const index = HandControllersAsync(async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const { idComercio } = req.params;

  const comercio = await StoreRepository.StoreRepository.findOne(idComercio);

  if (!comercio) HandError("Comercio no encontrado", 404);

  const categorias =
    await StoreRepository.CategoryRepository.getCategoriesByCommerceWithProducts(
      idComercio
    );

  if (!categorias || categorias.length === 0)
    HandError("Este comercio no cuenta con productos disponibles", 404);

  const { user } = req.session.user;
  const carrito = req.session.carrito || [];

  const factura =
    ClientRepository.OrderDetailsRepository.GenerarFactura(carrito);

  res.render("clientViews/storesList", {
    title: "Catalogo de productos",
    hasCategorias: categorias.length > 0,
    categorias,
    comercio,
    factura,
    user,
  });
});

export const addP = HandControllersAsync(async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Debes iniciar sesión para agregar productos",
    });
  }

  const { idProducto } = req.params;

  const producto = await StoreRepository.ProductsRepository.findOne(idProducto);
  if (!producto) {
    HandError("Producto no encontrado", 404);
  }

  if (!req.session.carrito) {
    req.session.carrito = [];
  }

  const existente = req.session.carrito.find(
    (item) => item.idProducto === idProducto
  );

  if (existente) {
    existente.createdAt = new Date();
  } else {
    req.session.carrito.push({
      idProducto: idProducto,
      createdAt: new Date(),
    });
  }
  req.session.save();

  req.flash("success", "El producto ha sido agregado de manera satisfactoria");

  res.redirect("/client/store/home");
});

export const deleteP = HandControllersAsync(async (req, res) => {
  if (!req.session.user) {
    req.flash("errors", "No tienes permiso para ingresar a esta ruta");
  }

  const { idProducto } = req.params;

  if (!req.session.carrito || req.session.carrito.length === 0) {
    return res.status(400).json({
      success: false,
      message: "El carrito está vacío",
    });
  }

  const indice = req.session.carrito.findIndex(
    (item) => item.idProducto === idProducto
  );

  if (indice === -1) {
    return res.status(404).json({
      success: false,
      message: "Producto no encontrado en el carrito",
    });
  }

  req.session.carrito[indice] -= 1;

  req.session.save();

  req.flash("success", " Producto eliminado");
  req.redirect("/client/store/home");
});
