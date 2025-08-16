import { StoreRepository } from "../../repositories/index.js";
import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";
import { HandError } from "../../utils/handlers/handlerError.js";

export const index = HandControllersAsync(async (req, res) => {
  const userId = req.session.user.id;

  console.log("userId :>> ", userId);

  const store = await StoreRepository.getStoreByUserId(userId);

  if (!store) HandError(404, "Comercio no encontrado");

  const pedidos = await StoreRepository.getPedidoByStore(userId);

  const hasAsignedDelivery = pedidos.some((pedido) => pedido.deliveryId);

  return res.render("storeViews/home", {
    title: "My store",
    user: req.user,
    store,
    hasPedidos: pedidos.length > 0,
    pedidos,
    hasAsignedDelivery,
  });
});

export const StorePerfil = HandControllersAsync(async (req, res) => {
  const userId = req.session.user.id;

  const store = await StoreRepository.getStoreByUserId(userId);

  if (!store) HandError(404, "Comercio no encontrado");

  return res.render("store/perfil", {
    title: "My perfil",
    user: req.user,
    store,
  });
});
