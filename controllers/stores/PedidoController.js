import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";
import { HandError } from "../../utils/handlers/handlerError.js";
import {
  DeliveryRepository,
  StoreRepository,
  ClientRepository,
} from "../../repositories/index.js";

import formatear from "../../utils/helpers/dateFormat.js";

export const index = HandControllersAsync(async (req, res) => {
  const { idPedido } = req.params;

  const dataP = await StoreRepository.OrderRepository.getOrderById(idPedido);

  if (!dataP) {
    HandError(404, "Pedido no encontrado");
  }

  const pedido = dataP.dataValues;

  const fecha = formatear(pedido.fecha);

  pedido.fecha = fecha;

  const detalleData = await ClientRepository.OrderDetailsRepository.findAll({
    where: { pedidoId: idPedido },
  });

  const detalles = detalleData.map((detalle) => detalle.dataValues);

  let dataProducts = await StoreRepository.ProductsRepository.findAll();

  const data = detalles.map((detalle) =>
    dataProducts.find((a) => a.id === detalle.productoId)
  );

  const productos = data.map((a) => a.dataValues);

  return res.render("storeViews/pedidos/index", {
    title: `Pedido #${idPedido}`,
    user: req.user,
    pedido,
    detalles,
    productos,
    delivery: pedido.deliveryId,
  });
});
export const assignDelivery = HandControllersAsync(async (req, res) => {
  const { user } = req.session;
  const pedidoId = req.params.id;

  try {
    const pedido = await StoreRepository.OrderRepository.findById(pedidoId);

    if (!pedido) {
      req.flash("errors", "Pedido no encontrado");
      return res.redirect(`/store/pedido/index/${pedidoId}`);
    }

    const dataComer = await StoreRepository.StoreRepository.findOne({
      where: { userId: user.id },
    });

    if (!dataComer) {
      req.flash("errors", "Comercio no encontrado");
      return res.redirect("/store/pedido/index/${pedidoId}");
    }

    const comercio = dataComer.dataValues;

    if (pedido.comercioId !== comercio.id) {
      req.flash("errors", "No tiene permisos para modificar este pedido");
      return res.redirect(`/store/pedido/index/${pedidoId}`);
    }

    const disponible = await DeliveryRepository.getAvailableDelivery();

    if (!disponible) {
      req.flash(
        "errors",
        "No se encontraron deliveries disponibles, intenta en un rato"
      );
      return res.redirect(`/store/pedido/index/${pedidoId}`);
    }

    const transaction =
      await StoreRepository.OrderRepository.startTransaction();

    try {
      await StoreRepository.OrderRepository.update(
        pedidoId,
        { deliveryId: disponible.id, estado: "en proceso" },
        { transaction }
      );

      await DeliveryRepository.updateDeliveryStatus(disponible.id, "ocupado", {
        transaction,
      });

      await transaction.commit();

      req.flash(
        "success",
        `Delivery ${disponible.name} ${disponible.lastName} asignado exitosamente`
      );

      return res.redirect(`/store/pedido/index/${pedidoId}`);
    } catch (transactionError) {
      await transaction.rollback();
      console.error("Transaction error:", transactionError);
      req.flash("errors", "Hubo un error tratando de asignar el delivery");
      return res.redirect(`/store/pedido/index/${pedidoId}`);
    }
  } catch (error) {
    console.error("Error in assignDelivery:", error);
    req.flash("errors", "Error interno del servidor");
    return res.redirect(`/store/pedido/index/${pedidoId}`);
  }
});
