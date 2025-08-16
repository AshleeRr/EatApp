import context from "../config/context/AppContext.js";
import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";
import { HandError } from "../../utils/handlers/handlerError.js";
import {
  DeliveryRepository,
  StoreRepository,
} from "../../repositories/index.js";

/*
export function GetIndex(req, res, next){
    res.render("delivery/home", {"page-title": "Home/Delivery", layout:"DeliveryLayout"});
}*/

export const completeOrder = HandControllersAsync(async (req, res) => {
  const pedidoId = req.params.id;

  const pedido = await StoreRepository.OrderRepository.getOrderById(pedidoId);

  if (!pedido) HandError(404, "Pedido no encontrado");

  if (pedido.deliveryId !== req.user.deliveryId)
    HandError(403, "No tiene permisos para completar este pedido");

  if (pedido.estado !== "en proceso")
    HandError(400, "Solo se pueden completar pedidos que están en proceso");

  const transaction = await StoreRepository.OrderRepository.startTransaction();

  await StoreRepository.OrderRepository.update(
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

  const pedidoActualizado = await StoreRepository.OrderRepository.getOrderById(
    pedidoId
  );

  if (!pedidoActualizado) HandError(400, "El pedido no ha podido ser asignado");

  req.flash("success", "El pedido ha sido completado");

  res.render("ruta/ruta del delivery", {
    titutlo: "lo deje asi por que no se cual es la ruta del delivery",
  });
});

export const unassignDelivery = HandControllersAsync(async (req, res) => {
  const pedidoId = req.params.id;

  const pedido = await StoreRepository.OrderRepository.getOrderById(pedidoId);

  if (!pedido) HandError(404, "Pedido no encontrado");

  if (pedido.comercioId !== req.user.comercioId)
    HandError(403, "No tiene permisos para modificar este pedido");

  if (!pedido.deliveryId || pedido.estado !== "en proceso")
    HandError(400, "Solo se puede desasignar delivery de pedidos en proceso");

  const transaction = await StoreRepository.OrderRepository.startTransaction();

  await DeliveryRepository.updateDeliveryStatus(
    pedido.deliveryId,
    "disponible",
    { transaction }
  );

  await StoreRepository.OrderRepository.update(
    pedidoId,
    { deliveryId: null, estado: "pendiente" },
    { transaction }
  );

  await transaction.commit();

  const pedidoActualizado = await StoreRepository.OrderRepository.getOrderById(
    pedidoId
  );
  if (!pedidoActualizado) HandError(400, "El pedido no ha podido ser asignado");

  res.render("ruta/ruta del delivery", {
    titutlo: "lo deje asi por que no se cual es la ruta del delivery",
  });
});
