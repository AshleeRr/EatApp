import {
  StoreRepository,
  CategoryRepository,
  ProductsRepository,
} from "../repository/index.js";

import { HandControllersAsync } from "../utils/handlers/handlerAsync.js";

export const index = HandControllersAsync(async (req, res) => {
  const userId = req.user.id;

  console.log("userId :>> ", userId);

  const store = await StoreRepository.getStoreByUserId(userId);

  if (!store) {
    return res.status(404).json({
      message: "Comercio no encontrado",
    });
  }

  const pedidos = await StoreRepository.getPedidoByStore(userId);

  return res.render("store/index", {
    title: "Mi comercio",
    user: req.user,
    store,
    hasPedidos: pedidos.length > 0,
    pedidos,
  });
});
