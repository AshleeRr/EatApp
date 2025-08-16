// import { where } from "sequelize";
import context from "../../config/context/AppContext.js";

//Handlers
import { HandRepositoriesAsync } from "../../utils/handlers/handlerAsync.js";
import HandError from "../../utils/handlers/handlerError.js";

//needed repositories
import GenericRepository from "../GenericRepository.js";

const { Pedido } = context;
const PedidoRepo = new GenericRepository(Pedido);

class OrderRespository extends GenericRepository {
  constructor() {
    super(context.Pedido);
  }
  getAllOrders = HandRepositoriesAsync(async () => {
    return await super.findAll({
      include: [
        {
          model: db.Cliente,
          as: "cliente",
          attributes: ["id", "name", "email"],
        },
        {
          model: db.Comercio,
          as: "comercio",
          attributes: ["id", "name", "logo", "activo"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  });

  getOrderById = HandRepositoriesAsync(async (id) => {
    return await super.findByPk(id, {
      include: [
        {
          model: db.Cliente,
          as: "cliente",
          attributes: ["id", "name", "email"],
        },
        {
          model: db.Comercio,
          as: "comercio",
          attributes: ["id", "name", "logo", "activo"],
        },
      ],
    });
  });

  getTodayOrders = HandRepositoriesAsync(async () => {
    const orders = await super.findAll();

    const todayOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      const today = new Date();
      return (
        orderDate.getDate() === today.getDate() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear()
      );
    });
    if (!todayOrders)
      HandError(404, "No hay ordenes registradas el dia de hoy");

    return todayOrders;
  });

  getOrderByUserId = HandRepositoriesAsync(async (id, usuarioId) => {
    return await super.findOne({
      where: { id: id, clienteId: usuarioId },
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
    return await db.sequelize.transaction();
  });
}

export default new OrderRespository();
