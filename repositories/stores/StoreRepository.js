import context from "../../config/context/AppContext.js";
import Comercio from "../../models/comercio.js";
import { HandRepositoriesAsync } from "../../utils/handlers/handlerAsync.js";
import GenericRepository from "../GenericRepository.js";

import { Sequelize } from "sequelize";
import formatear from "../../utils/helpers/dateFormat.js";
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
          as: "Pedidos",
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

  getPedidoByStore = HandRepositoriesAsync(async (userId) => {
    const comercio = await this.getStoreByUserId(userId);
    if (!comercio) throw new Error("Comercio no encontrado");

    const pedidos = await Pedido.findAll({
      where: { comercioId: comercio.id },
      order: [
        [
          Sequelize.literal(`
          CASE estado 
            WHEN 'pendiente' THEN 1 
            WHEN 'en proceso' THEN 2 
            WHEN 'completado' THEN 3 
            ELSE 4 
          END
        `),
          "ASC",
        ],
        ["createdAt", "DESC"],
      ],
      include: [
        {
          model: context.DetallePedido,
          as: "detalles",
          include: [
            {
              model: Producto,
              as: "producto",
            },
          ],
        },
      ],
    });

    const pedido = pedidos.map((pedido) => {
      const dto = pedido.dataValues;
      return {
        ...dto,
        fecha: formatear(dto.fecha),
        original: dto.fecha || dto.createdAt,
        detalles: pedido.detalles,
      };
    });

    return pedido;
  });
  getPedidoByStoreStatus = HandRepositoriesAsync(
    async (userId, estado = null) => {
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
    }
  );

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
