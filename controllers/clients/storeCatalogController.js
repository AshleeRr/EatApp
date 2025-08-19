import { StoreRepository, ClientRepository } from "../../repositories/index.js";
//handlers
import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";
import { HandError } from "../../utils/handlers/handlerError.js";
export const index = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (!user) {
    return res.redirect("/login");
  }

  const { id } = req.params;

  const data = await StoreRepository.StoreRepository.findById(id);
  const comercio = data.dataValues;

  if (!comercio) HandError("Comercio no encontrado", 404);

  const dataCat =
    await StoreRepository.CategoryRepository.getCategoriesByCommerceWithProducts(
      id
    );
  const categorias = dataCat.map((cat) => cat.toJSON());

  console.log("categorias :>> ", categorias);

  const carrito = req.session.carrito || [];

  let factura = null;
  if (carrito.length > 0) {
    const facturaData =
      await ClientRepository.OrderDetailsRepository.GenerarFactura(carrito);
    factura = facturaData.factura;
  }
  res.render("clientViews/store/index", {
    title: "Catalogo de productos",
    hasCategorias: categorias.length > 0,
    categorias,
    comercio,
    hasCarrito: carrito.length > 0,
    carrito,
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

  const { idProducto } = req.body;
  console.log("idProducto :>> ", idProducto);

  const producto = await StoreRepository.ProductsRepository.findById(
    idProducto
  );
  if (!producto) {
    HandError("Producto no encontrado", 404);
  }

  if (!req.session.carrito) {
    req.session.carrito = [];
  }

  const existente = req.session.carrito.find(
    (item) => item.producto.id === parseInt(idProducto)
  );

  if (existente) {
    existente.createdAt = new Date();
    req.flash("info", "El producto ya está en tu carrito");
  } else {
    req.session.carrito.push({
      producto: producto.toJSON ? producto.toJSON() : producto,
      createdAt: new Date(),
    });
    req.flash("success", "Producto agregado al carrito");
  }

  req.session.save();
  res.redirect(`/client/store/home/${producto.comercioId}`);
});

export const deleteP = HandControllersAsync(async (req, res) => {
  if (!req.session.user) {
    req.flash("errors", "No tienes permiso para ingresar a esta ruta");
    return res.redirect("/login");
  }

  const { idProducto } = req.body;

  const indice = req.session.carrito.findIndex(
    (item) => item.producto.id === parseInt(idProducto)
  );

  if (indice === -1) {
    return res.status(404).json({
      success: false,
      message: "Producto no encontrado en el carrito",
    });
  }
  req.session.carrito.splice(indice, 1);

  req.session.save();

  req.flash("success", "Producto eliminado del carrito");
  res.redirect("back");
});
