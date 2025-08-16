import context from "../../config/context/AppContext.js";
import { HandRepositoriesAsync } from "../../utils/handlers/handlerAsync.js";
import GenericRepository from "../GenericRepository.js";

const { TipoComercio, User, Categoria, Producto, Pedido, Favorito } = context;

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
          model: User,
          as: "cliente",
          attributes: ["id", "email"],
        },
        {
          model: User,
          as: "delivery",
          attributes: ["id", "email"],
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
