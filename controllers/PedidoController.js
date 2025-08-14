import { OrderRepository } from "../repository/index.js";
import { HandControllersAsync } from "../utils/handlers/handlerAsync.js";
import { HandError } from "../utils/handlers/handlerError.js";

export const index = HandControllersAsync(async (req, res) => {
  const pedidoId = req.params.id;
  const pedido = await OrderRepository.getOrderById(pedidoId);

  if (!pedido) {
    HandError(404, "Pedido no encontrado");
  }

  return res.render("store/pedido/index", {
    title: `Pedido #${pedidoId}`,
    user: req.user,
    pedido,
  });
});
