import db from "../config/context/AppContext.js";
import { HandRepositoriesAsync } from "../utils/handlers/handlerAsync.js";
import GenericRepository from "./genericRepository.js";
import { Op } from "sequelize";

const { Pedido, DetallePedido } = db;
const PedidoRepo = new GenericRepository(Pedido);

class OrderRespository {
  getAllOrders = HandRepositoriesAsync(async () => {
    return await Pedido.findAll({
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
    return await Pedido.findByPk(id, {
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

  createOrder = HandRepositoriesAsync(async (data) => {
    return await PedidoRepo.create(data);
  });

  updateOrder = HandRepositoriesAsync(async (id, data) => {
    return await PedidoRepo.update(id, data);
  });

  deleteOrder = HandRepositoriesAsync(async (id) => {
    return await PedidoRepo.delete(id);
  });
}

export default new OrderRespository();
