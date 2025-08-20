import { StoreRepository, ClientRepository } from "../../repositories/index.js";

//handlers
import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";
import { HandError } from "../../utils/handlers/handlerError.js";

export const index = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (!user || user.role !== "client") {
    req.flash("errors", "No tienes permisos para estar aquí");
    return res.redirect("/");
  }
  const data = await ClientRepository.clientRepository.findOne({
    where: { userId: user.id },
  });

  const cliente = data.dataValues;

  const dataFav = await ClientRepository.clientRepository.getFavoritos(
    cliente.id
  );

  const favoritos = dataFav.map((fav) => fav.dataValues);

  if (!favoritos) HandError(404, "No tienes comercios favoritos agregados!");

  res.render("clientViews/favorites/index", {
    user: cliente,
    title: "Comercios Favoritos",
    favoritos,
    hasFavoritos: favoritos.length > 0,
  });
});

export const addFavorite = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (!user || user.role !== "client") {
    req.flash("errors", "No tienes permisos para estar aquí");
    return res.redirect("/");
  }

  const { userId, businessId } = req.body;

  try {
    await ClientRepository.clientRepository.addFavorite(userId, businessId);

    const comercio = await StoreRepository.StoreRepository.findById(businessId);

    req.flash(
      "success",
      `El comercio ${comercio.name} fue agregado a favoritos`
    );
    return res.redirect("/client/favorites/home");
  } catch (error) {
    req.flash("errors", error.message || "Hubo un error agregando el favorito");
    return res.redirect("/client/favorites/home");
  }
});

export const removeFavorite = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (!user || user.role !== "client") {
    req.flash("errors", "No tienes permisos para estar aquí");
    return res.redirect("/");
  }
  const { userId, businessId } = req.body;

  const eliminado = await ClientRepository.clientRepository.deleteFavorite(
    userId,
    businessId
  );

  const comercio = await StoreRepository.StoreRepository.findById(businessId);

  if (!eliminado) {
    HandError(
      "500",
      `Hubo un error tratando de eliminar ${comercio.name} de favoritos`
    );
  }

  req.flash("success", `El comercio ${comercio.name} fue removido`);

  res.redirect("/client/favorites/home");
});
