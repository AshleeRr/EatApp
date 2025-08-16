import db from "../../config/context/AppContext.js";
import { Op } from "sequelize";
import { HandRepositoriesAsync } from "../../utils/handlers/handlerAsync.js";
import GenericRepository from "../GenericRepository.js";

const { Categoria, Comercio, DetallePedido } = db;

class ProductsRepository extends GenericRepository {
  constructor() {
    super(context.Producto);
  }
  getAllProducts = HandRepositoriesAsync(async () => {
    return await super.findAll({
      include: [
        { model: Categoria, as: "categoria" },
        {
          model: Comercio,
          as: "comercio",
          attributes: ["id", "name", "logo", "activo"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  });
  getProductById = HandRepositoriesAsync(async (id) => {
    return await super.findOne(id, {
      include: [
        { model: Categoria, as: "categoria" },
        {
          model: Comercio,
          as: "comercio",
          attributes: ["id", "name", "logo", "opening", "closing"],
        },
      ],
    });
  });
  getProductsByStore = HandRepositoriesAsync(async (comercioId) => {
    return await super.findAll({
      where: { comercioId },
      include: [
        { model: Categoria, as: "categoria" },
        {
          model: Comercio,
          as: "comercio",
          attributes: ["id", "name", "logo", "opening", "closing", "activo"],
        },
      ],
      order: [
        [{ model: Categoria, as: "categoria" }, "nombre", "ASC"],
        ["nombre", "ASC"],
      ],
    });
  });
  getProductsByStoreGroupedByCategory = HandRepositoriesAsync(
    async (comercioId) => {
      const productos = await super.findAll({
        where: { comercioId },
        include: [
          { model: Categoria, as: "categoria" },
          {
            model: Comercio,
            as: "comercio",
            attributes: ["id", "name", "logo", "opening", "closing", "activo"],
          },
        ],
        order: [
          [{ model: Categoria, as: "categoria" }, "nombre", "ASC"],
          ["nombre", "ASC"],
        ],
      });

      const productsList = {};
      productos.forEach((producto) => {
        const categoria = producto.categoria?.nombre || "Sin categoría";
        if (!productsList[categoria]) {
          productsList[categoria] = [];
        }
        productsList[categoria].push(producto);
      });

      return productsList;
    }
  );
  searchProductsByName = HandRepositoriesAsync(
    async (nombre, comercioId = null) => {
      const whereClause = {
        nombre: {
          [Op.like]: `%${nombre}%`,
        },
      };

      if (comercioId) {
        whereClause.comercioId = comercioId;
      }

      return await super.findAll({
        where: whereClause,
        include: [
          { model: Categoria, as: "categoria" },
          {
            model: Comercio,
            as: "comercio",
            attributes: ["id", "name", "logo", "activo"],
          },
        ],
        order: [["nombre", "ASC"]],
      });
    }
  );
  deleteProduct = HandRepositoriesAsync(async (id) => {
    const detallesPedidos = await DetallePedido.findAll({
      where: { PedidoId: id },
    });

    if (detallesPedidos.length > 0) {
      throw new Error(
        "No se puede eliminar el producto porque tiene pedidos asociados"
      );
    }

    return await super.delete(id);
  });
}

export default new ProductsRepository();
