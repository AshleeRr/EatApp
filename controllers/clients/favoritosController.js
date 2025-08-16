import { StoreRepository, ClientRepository } from "../../repositories/index.js";

//handlers
import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";
import { HandError } from "../../utils/handlers/handlerError.js";

export const index = HandControllersAsync(async (req, res) => {
  if (!req.session.user) {
    req.flash("errors", "No tienes permiso para ingresar a esta ruta");
  }

  const { idUsuario } = req.params;

  const favoritos = await ClientRepository.clientRepository.getFavoritos(
    idUsuario
  );

  if (!favoritos) HandError(404, "No tienes comercios favoritos agregados!");

  res.render("clientViews/favorites/index", {
    title: "Comercios Favoritos",
    favoritos,
  });
});

export const addFavorite = HandControllersAsync(async (req, res) => {
  if (!req.session.user) {
    req.flash("errors", "No tienes permiso para ingresar a esta ruta");
  }

  const { idUsuario, idComercio } = req.params;

  const nuevoFavorito = await ClientRepository.clientRepository.addFavorite(
    idUsuario,
    idComercio
  );

  const comercio = await StoreRepository.StoreRepository.findOne(idComercio);

  if (!nuevoFavorito) {
    HandError(
      "500",
      `Hubo un error tratando de agregar ${comercio.name} a favoritos`
    );
  }

  req.flash("success", `El comercio ${comercio.name} fue agregado a favoritos`);

  req.redirect("/client/favorite/home");
});

export const removeFavorite = HandControllersAsync(async (req, res) => {
  if (!req.session.user) {
    req.flash("errors", "No tienes permiso para ingresar a esta ruta");
  }

  const { idUsuario, idComercio } = req.params;

  const eliminado = await ClientRepository.clientRepository.deleteFavorite(
    idUsuario,
    idComercio
  );

  const comercio = await StoreRepository.StoreRepository.findOne(idComercio);

  if (!eliminado) {
    HandError(
      "500",
      `Hubo un error tratando de eliminar ${comercio.name} de favoritos`
    );
  }

  req.flash("success", `El comercio ${comercio.name} fue removido`);

  req.redirect("/client/favorite/home");
});
