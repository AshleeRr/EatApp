import context from "../config/context/AppContext.js";

import { HandRepositoriesAsync } from "../utils/handlers/handlerAsync.js";
import GenericRepository from "./genericRepository.js";

const { Delivery, User } = context;

const DeliveryRepo = new GenericRepository(Delivery);

class DeliveryRepository {
  getAvailableDelivery = HandRepositoriesAsync(async () => {
    return await Delivery.findOne({
      where: {
        estado: "disponible",
        activo: true,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["nombre", "apellido", "telefono"],
        },
      ],
      order: [["updatedAt", "ASC"]],
    });
  });

  updateDeliveryStatus = HandRepositoriesAsync(
    async (deliveryId, estado, options = {}) => {
      return await Delivery.update(
        { estado },
        {
          where: { id: deliveryId },
          ...options,
        }
      );
    }
  );

  getAvailableDeliveries = HandRepositoriesAsync(async () => {
    return await Delivery.findAll({
      where: {
        estado: "disponible",
        activo: true,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["nombre", "apellido", "telefono"],
        },
      ],
      order: [["updatedAt", "ASC"]],
    });
  });
}

export default new DeliveryRepository();
