import { where } from "sequelize";
import { ClientRepository, StoreRepository } from "../../repositories/index.js";

//handlers
import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";

export const index = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (!user || user.role !== "client") {
    req.flash("errors", "No tienes permisos para estar aquí");
    return res.redirect("/");
  }

  const dataClient = await ClientRepository.clientRepository.findOne({
    where: { userId: user.id },
  });

  const cliente = dataClient.dataValues;

  const pedidos =
    (await ClientRepository.clientRepository.getOrdersByClient(cliente.id)) ||
    {};

  for (const pedido of pedidos) {
    const detalles = await ClientRepository.OrderDetailsRepository.findAll({
      where: { pedidoId: pedido.id },
    });
    pedido.productos = detalles.length;
  }

  console.log("pedido :>> ", pedidos);

  res.render("clientViews/history/index", {
    title: "Historial de pedidos",
    pedidos,
    hasPedidos: pedidos.length > 0,
  });
});

export const verDetalle = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (!user || user.role !== "client") {
    req.flash("errors", "No tienes permisos");
    return res.redirect("/");
  }

  const idPedido = parseInt(req.params.id);

  if (!idPedido) {
    req.flash("errors", "ID de pedido ta mal");
    return res.redirect("/client/history");
  }

  const dataClient = await ClientRepository.clientRepository.findOne({
    where: { userId: user.id },
  });

  if (!dataClient) {
    req.flash("errors", "Cliente no encontrado");
    return res.redirect("/");
  }

  const cliente = dataClient.dataValues;

  const pedidos = await ClientRepository.clientRepository.getOrdersByClient(
    cliente.id
  );

  const pedido = pedidos.find((p) => parseInt(p.id) === idPedido);

  if (!pedido) {
    console.log("Pedido no encontrado. ID buscado:", idPedido);
    req.flash("errors", "Pedido no encontrado");
    return res.redirect("/client/history");
  }

  const detalleData = await ClientRepository.OrderDetailsRepository.findAll({
    where: { pedidoId: idPedido },
  });

  const detalles = detalleData.map((detalle) => detalle.dataValues);

  let dataProducts = await StoreRepository.ProductsRepository.findAll();

  const data = detalles.map((detalle) =>
    dataProducts.find((a) => a.id === detalle.productoId)
  );

  const productos = data.map((a) => a.dataValues);

  res.render("clientViews/history/orderDetail", {
    title: `Detalles del Pedido #${pedido.id}`,
    detalles,
    productos,
    pedido,
  });
});
