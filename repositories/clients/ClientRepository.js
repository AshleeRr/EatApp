import Context from "../../config/context/AppContext.js";
import { HandRepositoriesAsync } from "../../utils/handlers/handlerAsync.js";

//repositories imports
import GenericRepository from "../GenericRepository.js";
import OrderRepository from "../stores/OrderRepository.js";

//hleper
import toTitleCase from "../../utils/helpers/changerCase.js";
const { User, Direccion, Pedido, Favorito, Comercio, DetallePedido, Producto } =
  Context;

import formatear from "../../utils/helpers/dateFormat.js";
import { DATE } from "sequelize";
class ClientRepository extends GenericRepository {
  constructor() {
    super(Context.Client);
  }

  findAllOrders = HandRepositoriesAsync(async () => {
    return await super.findAll({
      include: [
        {
          model: Pedido,
          as: "pedidosCliente",
        },
        {
          model: User,
          attributes: ["id", "email", "isActive"],
        },
      ],
    });
  });
  findById = HandRepositoriesAsync(async (id) => {
    return await super.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ["id", "email", "role"],
        },
      ],
    });
  });
  getOrdersHistory = HandRepositoriesAsync(async (id, limit = 10) => {
    return await OrderRepository.findAll({
      where: { clienteId: id },
      include: [
        {
          model: Comercio,
          as: "comercio",
          attributes: ["id", "nombre", "imagen"],
        },
        {
          model: DetallePedido,
          as: "detalles",
          include: [
            {
              model: Producto,
              as: "producto",
              attributes: ["id", "nombre", "precio", "imagen"],
            },
          ],
        },
        {
          model: Direccion,
          as: "direccion",
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: limit,
    });
  });
  getActiveOrders = HandRepositoriesAsync(async (userId) => {
    return await OrderRepository.findAll({
      where: {
        clienteId: userId,
        estado: ["pendiente", "en proceso", "completado"],
      },
      include: [
        {
          model: Comercio,
          as: "comercio",
          attributes: ["id", "nombre", "telefono"],
        },
        {
          model: DetallePedido,
          as: "detalles",
          include: [
            {
              model: Producto,
              as: "producto",
              attributes: ["id", "nombre", "precio"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  });
  getFavoritos = HandRepositoriesAsync(async (userId) => {
    return await Favorito.findAll({
      where: { clienteId: userId },
      include: [
        {
          model: Comercio,
          as: "comercio",
          attributes: ["id", "name", "logo"],
        },
      ],
    });
  });
  addFavorite = HandRepositoriesAsync(async (userId, comercioId) => {
    const favoritoExiste = await Favorito.findOne({
      where: { clienteId: userId, comercioId },
    });
    if (favoritoExiste) {
      throw new Error("El comercio ya está en favoritos");
    }
    return await Favorito.create({
      clienteId: userId,
      comercioId,
    });
  });
  deleteFavorite = HandRepositoriesAsync(async (userId, comercioId) => {
    const resultado = await Favorito.destroy({
      where: { clienteId: userId, comercioId },
    });
    if (resultado === 0) {
      throw new Error("Favorito no encontrado");
    }
    return resultado;
  });
  getDirections = HandRepositoriesAsync(async (userId) => {
    return await Direccion.findAll({
      where: { usuarioId: userId },
      order: [["createdAt", "DESC"]],
    });
  });
  addDirection = HandRepositoriesAsync(async (userId, directionData) => {
    return await Direccion.create({
      ...directionData,
      usuarioId: userId,
    });
  });
  getClientStadistics = HandRepositoriesAsync(async (userId) => {
    const totalPedidos = await Pedido.count({
      where: { clienteId: userId },
    });
    const pedidosCompletados = await Pedido.count({
      where: {
        clienteId: userId,
        estado: "entregado",
      },
    });
    const totalFavoritos = await Favorito.count({
      where: { clienteId: userId },
    });
    const totalDirecciones = await Direccion.count({
      where: { usuarioId: userId },
    });
    return {
      totalPedidos,
      pedidosCompletados,
      totalFavoritos,
      totalDirecciones,
    };
  });

  getOrdersByClient = HandRepositoriesAsync(async (id) => {
    const dataPed = await Pedido.findAll({
      where: { clienteId: id },
    });

    const dta = dataPed.map((p) => p.dataValues);

    console.log("dta ya llego:>> ", dta);
    let pedidos = [];

    const comercios = await Comercio.findAll();
    const tiendas = comercios.map((t) => t.dataValues);

    dta.forEach((dto) => {
      const comercio =
        tiendas.find((tienda) => tienda.id === dto.comercioId) || {};

      const pedido = {
        id: dto.id,
        subtotal: dto.subtotal,
        total: dto.total,
        estado: toTitleCase(dto.estado),
        fecha: formatear(dto.fecha),
        clienteId: dto.clienteId,
        comercioId: dto.comercioId,
        comercio,
        deliveryId: dto.deliveryId,
        direccionId: dto.direccionId,
      };

      pedidos.push(pedido);
    });

    return pedidos;
  });
}
export default new ClientRepository();
