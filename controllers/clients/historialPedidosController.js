import { Store } from "express-session";
import { ClientRepository, StoreRepository } from "../../repositories/index.js";

//handlers
import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";
import { HandError } from "../../utils/handlers/handlerError.js";

export const index = HandControllersAsync(async (req, res) => {
  if (!req.session.user) {
    req.flash("errors", "No tienes permiso para ingresar a esta ruta");
  }

  const { idUsuario } = req.params;

  const pedidos = await ClientRepository.clientRepository.getOrdersHistory(
    idUsuario,
    20
  );

  if (!pedidos) HandError(404, "No tienes pedidos realizados!");

  res.render("clientViews/history/index", {
    title: "Historial de pedidos",
    pedidos,
  });
});

export const verDetalle = HandControllersAsync(async (req, res) => {
  const { idPedido, idUser } = req.params;

  const pedido = await StoreRepository.OrderRepository.getOrderByUserId(
    idPedido,
    idUser
  );

  if (!pedido) HandError(404, "Pedido no encontrado");
  const detalles = await ClientRepository.OrderDetailsRepository.findAll();

  const detallePedido = pedido.filter((p) => (p.id = detalle.idPedido));

  res.render("clientViews/history/orderDetails", {
    title: `Detalles del Pedido ${pedido.Name}`,
    pedido,
    detallePedido,
  });
});
