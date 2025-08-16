import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";
import { HandError } from "../../utils/handlers/handlerError.js";
import {
  DeliveryRepository,
  StoreRepository,
} from "../../repositories/index.js";

export const index = HandControllersAsync(async (req, res) => {
  const { pedidoId } = req.params;
  const pedido = await StoreRepository.OrderRepository.getOrderById(pedidoId);

  if (!pedido) {
    HandError(404, "Pedido no encontrado");
  }

  if (pedido.comercioId !== req.user.comercioId) {
    HandError(403, "No tiene permisos para ver este pedido");
  }

  return res.render("store/pedido/index", {
    title: `Pedido #${pedidoId}`,
    user: req.user,
    pedido,
  });
});

export const assignDelivery = HandControllersAsync(async (req, res) => {
  const { pedidoId } = req.params;

  const pedido = await StoreRepository.OrderRepository.getOrderById(pedidoId);

  if (!pedido) HandError(404, "Pedido no encontrado");

  if (pedido.comercioId !== req.user.comercioId)
    HandError(403, "No tiene permisos para modificar este pedido");

  if (pedido.estado !== "pendiente")
    HandError(400, "Solo se pueden asignar delivery a pedidos pendientes");

  if (pedido.deliveryId)
    HandError(400, "Este pedido ya tiene un delivery asignado");

  const deliveryDisponible = await DeliveryRepository.getAvailableDelivery();

  if (!deliveryDisponible)
    HandError(
      404,
      "No hay delivery disponible en este momento. Intente más tarde."
    );

  const transaction = await StoreRepository.OrderRepository.startTransaction();

  await StoreRepository.OrderRepository.update(
    pedidoId,
    { deliveryId: deliveryDisponible.id, estado: "en proceso" },
    { transaction }
  );

  await DeliveryRepository.updateDeliveryStatus(
    deliveryDisponible.id,
    "ocupado",
    { transaction }
  );

  const commit = await transaction.commit();

  if (!commit)
    HandError(500, "No se pudo asignar el delivery intentalo mas tarde");

  const pedidoActualizado = await StoreRepository.OrderRepository.getOrderById(
    pedidoId
  );
  req.flash(
    "success",
    `Delivery ${deliveryDisponible.nombre} ${deliveryDisponible.apellido} asignado exitosamente`
  );

  res.redirect("/store/pedido/index");
});
