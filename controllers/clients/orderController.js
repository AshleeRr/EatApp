import repo from "../../repositories/stores/index.js";
import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";
import { HandError } from "../../utils/handlers/handlerError.js";

import { ClientRepository, StoreRepository } from "../../repositories/index.js";

export const GenerateFacture = HandControllersAsync(async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const { user } = req.session.user;
  const carrito = req.session.carrito || [];

  if (carrito.length === 0)
    HandError(
      400,
      "No se puede generar la factura porque el carrito se encuentra vacio"
    );

  const factura =
    ClientRepository.OrderDetailsRepository.GenerarFactura(carrito);

  const direcciones = await ClientRepository.clientRepository.getDirections(
    user.id
  );

  res.render("clientsViews/order/select", {
    title: "Finalizar Compra",
    user,
    direcciones,
    factura,
    hayDirecciones: direcciones.length > 0,
  });
});

export const selectDirection = HandControllersAsync(async (req, res) => {
  const { direccionId } = req.body;
  const { user } = req.session.user;

  const direcciones = await ClientRepository.clientRepository.getDirections(
    user.id
  );

  const direccion = direcciones.filter((d) => d.id === direccionId);

  req.session.checkout = {
    direccion: direccion,
  };

  res.render("clientViews/order/create", {
    title: "Método de Pago",
    direccion: direccion,
    carrito: req.session.carrito,
    totales: await calcularTotalesCarrito(req.session.carrito),
  });
});

export const procesarPedido = HandControllersAsync(async (req, res) => {
  const { user } = req.session.user;
  const carrito = req.session.carrito || [];
  const checkoutData = req.session.checkout || {};

  if (carrito.length === 0) HandError(400, "El carrito no puede estar vacio");
  if (!checkoutData.direccion) HandError(400, "Debe seleccionar una direccion");

  const factura =
    ClientRepository.OrderDetailsRepository.GenerarFactura(carrito);

  console.log("factura :>> ", factura);

  const { productos, subtotal, itbis, total } = factura;

  const pedido = await StoreRepository.OrderRepository.create({
    clienteId: user.id,
    comercioId: productos[0].comercioId,
    direccionId: checkoutData.direccion.id,
    estado,
    subtotal,
    total,
    fecha: new Date(),
  });

  for (const producto of productos) {
    await ClientRepository.OrderDetailsRepository.create({
      pedidoId: pedido.id,
      precio: producto.precio,
      subtotal: producto.total,
    });
  }

  req.session.carrito = [];
  req.session.checkout = {};

  req.flash("success", "Esperando confirmacion");

  res.redirect(`/order/confirmacion`, {
    pedido: {
      id: pedido.id,
      total: pedido.total,
    },
    factura,
  });
});

export const confirmacion = HandControllersAsync(async (req, res) => {
  const { orderId } = req.params;
  const { user } = req.session.user;

  const pedido = await StoreRepository.OrderRepository.findOne(orderId);

  if (!pedido) {
    HandError("Pedido no encontrado", 404);
  }

  res.render("clientViews/order/confirm", {
    title: "Pedido Confirmado",
    pedido,
    user,
  });
});
