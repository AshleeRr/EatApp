import { HandControllersAsync } from "../utils/handlers/handlerAsync.js";
import { HandError } from "../utils/handlers/handlerError.js";
import { OrderRepository, DeliveryRepository } from "../repositories/index.js";

export const index = HandControllersAsync(async (req, res) => {
  const pedidoId = req.params.id;
  const pedido = await OrderRepository.getOrderById(pedidoId);

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
  const pedidoId = req.params.id;
  const pedido = await OrderRepository.getOrderById(pedidoId);
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

  const transaction = await OrderRepository.startTransaction();

  await OrderRepository.updateOrder(
    pedidoId,
    { deliveryId: deliveryDisponible.id, estado: "en proceso" },
    { transaction }
  );

  await DeliveryRepository.updateDeliveryStatus(
    deliveryDisponible.id,
    "ocupado",
    { transaction }
  );

  await transaction.commit();

  const pedidoActualizado = await OrderRepository.getOrderById(pedidoId);
  return res.json({
    success: true,
    message: `Delivery ${deliveryDisponible.nombre} ${deliveryDisponible.apellido} asignado exitosamente`,
    data: { pedido: pedidoActualizado, delivery: deliveryDisponible },
  });
});

export const completeOrder = HandControllersAsync(async (req, res) => {
  const pedidoId = req.params.id;

  const pedido = await OrderRepository.getOrderById(pedidoId);

  if (!pedido) HandError(404, "Pedido no encontrado");

  if (pedido.deliveryId !== req.user.deliveryId)
    HandError(403, "No tiene permisos para completar este pedido");

  if (pedido.estado !== "en proceso")
    HandError(400, "Solo se pueden completar pedidos que están en proceso");

  const transaction = await OrderRepository.startTransaction();

  await OrderRepository.updateOrder(
    pedidoId,
    { estado: "completado", fechaCompletado: new Date() },
    { transaction }
  );

  await DeliveryRepository.updateDeliveryStatus(
    pedido.deliveryId,
    "disponible",
    { transaction }
  );

  await transaction.commit();

  const pedidoActualizado = await OrderRepository.getOrderById(pedidoId);

  return res.json({
    success: true,
    message: "Pedido completado exitosamente",
    data: { pedido: pedidoActualizado },
  });
});

export const unassignDelivery = HandControllersAsync(async (req, res) => {
  const pedidoId = req.params.id;

  const pedido = await OrderRepository.getOrderById(pedidoId);

  if (!pedido) HandError(404, "Pedido no encontrado");

  if (pedido.comercioId !== req.user.comercioId)
    HandError(403, "No tiene permisos para modificar este pedido");

  if (!pedido.deliveryId || pedido.estado !== "en proceso")
    HandError(400, "Solo se puede desasignar delivery de pedidos en proceso");

  const transaction = await OrderRepository.startTransaction();

  await DeliveryRepository.updateDeliveryStatus(
    pedido.deliveryId,
    "disponible",
    { transaction }
  );

  await OrderRepository.updateOrder(
    pedidoId,
    { deliveryId: null, estado: "pendiente" },
    { transaction }
  );

  await transaction.commit();

  const pedidoActualizado = await OrderRepository.getOrderById(pedidoId);

  return res.json({
    success: true,
    message: "Delivery desasignado exitosamente",
    data: { pedido: pedidoActualizado },
  });
});
