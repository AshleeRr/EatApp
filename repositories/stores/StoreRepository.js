import context from "../../config/context/AppContext.js";
import { HandRepositoriesAsync } from "../../utils/handlers/handlerAsync.js";
import GenericRepository from "../GenericRepository.js";

const {
  TipoComercio,
  User,
  Categoria,
  Producto,
  Pedido,
  Favorito,
  Client,
  Delivery,
} = context;

class StoreRepository extends GenericRepository {
  constructor() {
    super(context.Comercio);
  }

  getStoreByUserId = HandRepositoriesAsync(async (userId) => {
    return await super.findOne({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ["id", "email", "role"],
        },
        {
          model: TipoComercio,
          as: "tipoComercio",
          attributes: ["id", "nombre", "descripcion"],
        },
      ],
    });
  });

  getDataStore = HandRepositoriesAsync(async () => {
    return await super.findAll({
      include: [
        {
          model: context.User,
          attributes: ["id", "email", "isActive"],
        },
        {
          model: context.TipoComercio,
          as: "tipoComercio",
          attributes: ["nombre", "descripcion"],
        },
        {
          model: context.Pedido,
          as: "pedidos",
          attributes: ["id"],
        },
      ],
    });
  });

  getStore = HandRepositoriesAsync(async (userId) => {
    return await super.findOne({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ["id", "email", "role"],
        },
        {
          model: TipoComercio,
          as: "tipoComercio",
        },
        {
          model: Categoria,
          as: "categorias",
          include: [
            {
              model: Producto,
              as: "productos",
            },
          ],
        },
        {
          model: Producto,
          as: "productos",
          include: [
            {
              model: Categoria,
              as: "categoria",
            },
          ],
        },
      ],
    });
  });

  getPedidoByStore = HandRepositoriesAsync(async (userId, estado = null) => {
    const comercio = await this.getStoreByUserId(userId);
    if (!comercio) throw new Error("Comercio no encontrado");

    const where = { comercioId: comercio.id };
    if (estado) where.estado = estado;

    return await Pedido.findAll({
      where: where,
      include: [
        {
          model: Client,
          as: "cliente",
          attributes: ["id", "name", "userName"],
          include: [
            {
              model: User,
              attributes: ["email"],
            },
          ],
        },
        {
          model: Delivery,
          as: "delivery",
          attributes: ["id", "name", "userName"],
          include: [
            {
              model: User,
              attributes: ["email"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  });

  getDashBoardStadistic = HandRepositoriesAsync(async (userId) => {
    const comercio = await this.getStoreByUserId(userId);
    if (!comercio) throw new Error("Comercio no encontrado");

    const totalProductos = await Producto.count({
      where: { comercioId: comercio.id },
    });

    const totalPedidos = await Pedido.count({
      where: { comercioId: comercio.id },
    });

    const pedidosPendientes = await Pedido.count({
      where: {
        comercioId: comercio.id,
        estado: "pendiente",
      },
    });

    const totalFavoritos = await Favorito.count({
      where: { comercioId: comercio.id },
    });

    return {
      totalProductos,
      totalPedidos,
      pedidosPendientes,
      totalFavoritos,
    };
  });
}

export default new StoreRepository();
