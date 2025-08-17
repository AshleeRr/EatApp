import context from "../../config/context/AppContext.js";
import { HandRepositoriesAsync } from "../../utils/handlers/handlerAsync.js";
import HandError from "../../utils/handlers/handlerError.js";
import GenericRepository from "../GenericRepository.js";

class OrderRepository extends GenericRepository {
  constructor() {
    super(context.Pedido);
  }

  getAllOrders = HandRepositoriesAsync(async () => {
    return await super.findAll({
      include: [
        {
          model: context.Client,
          as: "cliente",
          attributes: ["id", "name", "userName"],
        },
        {
          model: context.Comercio,
          as: "comercio",
          attributes: ["id", "name", "logo"],
        },
        {
          model: context.Delivery,
          as: "delivery",
          attributes: ["id", "name", "userName"],
        },
        {
          model: context.Direccion,
          as: "direccion",
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  });

  getOrderById = HandRepositoriesAsync(async (id) => {
    return await super.findOne({
      where: { id },
      include: [
        {
          model: context.Client,
          as: "cliente",
          attributes: ["id", "name", "userName"],
        },
        {
          model: context.Comercio,
          as: "comercio",
          attributes: ["id", "name", "logo"],
        },
        {
          model: context.DetallePedido,
          as: "detalles",
          include: [
            {
              model: context.Producto,
              as: "producto",
            },
          ],
        },
      ],
    });
  });

  getTodayOrders = HandRepositoriesAsync(async () => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const orders = await super.findAll({
      where: {
        createdAt: {
          [context.sequelize.Sequelize.Op.between]: [startOfDay, endOfDay],
        },
      },
      include: [
        {
          model: context.Client,
          as: "cliente",
          attributes: ["name", "userName"],
        },
        {
          model: context.Comercio,
          as: "comercio",
          attributes: ["name", "logo"],
        },
      ],
    });

    return orders;
  });

  getOrderByUserId = HandRepositoriesAsync(async (id, usuarioId) => {
    const cliente = await context.Client.findOne({
      where: { userId: usuarioId },
    });

    if (!cliente) {
      throw new Error("Cliente no encontrado");
    }

    return await super.findOne({
      where: { id: id, clienteId: cliente.id },
      include: [
        {
          model: context.DetallePedido,
          as: "detalles",
          include: [
            {
              model: context.Producto,
              as: "producto",
            },
          ],
        },
        {
          model: context.Direccion,
          as: "direccion",
        },
        {
          model: context.Comercio,
          as: "comercio",
        },
      ],
    });
  });

  startTransaction = HandRepositoriesAsync(async () => {
    return await context.sequelize.transaction();
  });
}

export default new OrderRepository();
