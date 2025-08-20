import { StoreRepository } from "../../repositories/index.js";
import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";
import { HandError } from "../../utils/handlers/handlerError.js";

//helper
import { saveIMG } from "../../services/imgSaver.js";

export const index = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "store") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }

  const data = await StoreRepository.StoreRepository.findOne({
    where: { userId: user.id },
  });

  const store = data.dataValues;

  const pedidos = await StoreRepository.StoreRepository.getPedidoByStore(
    user.id
  );

  const Pendientes =
    await StoreRepository.StoreRepository.getPedidoByStoreStatus(
      user.id,
      "pendiente"
    );
  const Procesandose =
    await StoreRepository.StoreRepository.getPedidoByStoreStatus(
      user.id,
      "en proceso"
    );

  const Completados =
    await StoreRepository.StoreRepository.getPedidoByStoreStatus(
      user.id,
      "completado"
    );

  return res.render("storeViews/home", {
    title: "My store",
    user: req.user,
    store: store,
    hasPedidos: pedidos.length > 0 || 0,
    pedidos,
    Pendientes,
    Completados,
    Procesandose,
  });
});

export const StorePerfil = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "store") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  const data = await StoreRepository.StoreRepository.findOne({
    where: { userId: user.id },
  });

  const store = data.dataValues;

  if (!store) HandError(404, "Comercio no encontrado");

  return res.render("storeViews/perfil", {
    title: "My perfil",
    user: req.user,
    store,
  });
});

export const actualizarPerfil = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "store") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }

  const store = await StoreRepository.StoreRepository.getStoreByUserId(user.id);

  if (!store) HandError(404, "Comercio no encontrado");

  const { name, phoneNumber, email, opening, closing } = req.body;
  const imagen = req.file;

  const logo = await saveIMG(imagen);

  await StoreRepository.StoreRepository.update(store.id, {
    name,
    phoneNumber,
    email,
    logo,
    opening,
    closing,
    userId: user.id,
    tipoComercioId: store.tipoComercioId,
  });

  req.flash("success", "El perfil de tu comercio ha sido actualizado");
  return res.redirect("/store/mycomerce");
});
