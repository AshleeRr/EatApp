import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";
import { HandError } from "../../utils/handlers/handlerError.js";

import { ClientRepository, StoreRepository } from "../../repositories/index.js";

export const GenerateFacture = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (!user || user.role !== "client") {
    req.flash("errors", "No tienes permisos para estar aquí");
    return res.redirect("/");
  }

  const carrito = req.session.carrito || [];

  if (carrito.length === 0)
    HandError(
      400,
      "No se puede generar la factura porque el carrito se encuentra vacio"
    );

  const objetoFa = await ClientRepository.OrderDetailsRepository.GenerarFactura(
    carrito
  );

  const factura = objetoFa.factura;

  const comercio = await StoreRepository.StoreRepository.findById(
    factura.productos.comercioId
  );

  const data = await ClientRepository.clientRepository.getDirections(user.id);

  const direcciones = data.map((d) => d.dataValues);

  res.render("clientViews/order/index", {
    title: "Finalizar Compra",
    user,
    direcciones,
    factura: factura,
    hasCarrito: carrito.length > 0,
    carrito,
    comercio,
    hayDirecciones: direcciones.length > 0,
  });
});
export const procesarPedido = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (!user || user.role !== "client") {
    req.flash("errors", "No tienes permisos para estar aquí");
    return res.redirect("/");
  }
  const carrito = req.session.carrito || [];
  const direccionId = Number(req.body.idDireccion);

  const cliente = await ClientRepository.clientRepository.findOne({
    where: { userId: user.id },
  });

  const factura = await ClientRepository.OrderDetailsRepository.GenerarFactura(
    carrito
  );

  const { productos, subtotal, itbis, total } = factura.factura;

  const pedido = await StoreRepository.OrderRepository.create({
    subtotal,
    total,
    estado: "pendiente",
    clienteId: cliente.id,
    comercioId: carrito[0].producto.comercioId,
    deliveryId: null,
    direccionId,
  });

  for (const producto of productos) {
    const detalle = await ClientRepository.OrderDetailsRepository.create({
      pedidoId: pedido.id,
      precio: producto.precio,
      subtotal: producto.total,
      productoId: producto.id,
      cantidad: 1,
    });
    console.log("detalle del pedido :>> ", detalle);
  }

  req.session.carrito = [];
  req.session.save();

  console.log("pedido :>> ", pedido);
  req.flash("success", "Esperando confirmacion");
  res.redirect(`/client/order/confirmation/${pedido.id}`);
});

export const confirmacion = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (!user || user.role !== "client") {
    req.flash("errors", "No tienes permisos para estar aquí");
    return res.redirect("/");
  }
  const idPedido = req.params.id;

  const pedido = await StoreRepository.OrderRepository.findById(idPedido);

  if (!pedido) {
    HandError("Pedido no encontrado", 404);
  }

  res.render("clientViews/order/confirm", {
    title: "Pedido Confirmado",
    pedido,
    user,
  });
});
