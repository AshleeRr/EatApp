import context from "../../config/context/AppContext.js";
import GenericRepository from "../GenericRepository.js";
//handlers
import { HandRepositoriesAsync } from "../../utils/handlers/handlerAsync.js";

// const DeliveryRepo = new GenericRepository(Delivery);
const { User } = context;

class DeliveryRepository extends GenericRepository {
  constructor() {
    super(context.Delivery);
  }

  findAll = HandRepositoriesAsync(async () => {
    return super.findAll({
      include: [
        {
          model: context.User,
          attributes: ["id", "email", "isActive"],
        },
        {
          model: context.Pedido,
          as: "pedidosDelivery",
          attributes: ["id"],
        },
      ],
    });
  });
  getAvailableDelivery = HandRepositoriesAsync(async () => {
    return await super.findOne({
      where: {
        estado: "disponible",
      },
      include: [
        {
          model: User,
        },
      ],
      order: [["updatedAt", "ASC"]],
    });
  });
  updateDeliveryStatus = HandRepositoriesAsync(
    async (deliveryId, estado, options = {}) => {
      return await super.update(
        deliveryId,   
      { estado },   
      options          
    );
  }
);
  getAvailableDeliveries = HandRepositoriesAsync(async () => {
    return await super.findAll({
      where: {
        estado: "disponible",
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["nombre", "apellido", "telefono", "isActive"],
        },
      ],
      order: [["updatedAt", "ASC"]],
    });
  });
}
export default new DeliveryRepository();
