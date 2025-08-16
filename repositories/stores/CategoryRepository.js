import context from "../../config/context/AppContext.js";
import { Op } from "sequelize";

//handlers
import { HandRepositoriesAsync } from "../../utils/handlers/handlerAsync.js";

//import nedeed repositories
import GenericRepository from "../GenericRepository.js";
import StoreRepository from "./StoreRepository.js";
import ProductsRepository from "./ProductsRepository.js";

//models
const { Comercio, Producto } = context;

class CategoriesRepository extends GenericRepository {
  constructor() {
    super(context.Categoria);
  }

  getCategoriesByCommerce = HandRepositoriesAsync(async (comercioId) => {
    return await super.findAll({
      where: { comercioId },
      include: [
        {
          model: Producto,
          as: "productos",
          attributes: [],
        },
      ],
      attributes: [
        "id",
        "nombre",
        "descripcion",
        [
          db.sequelize.fn("COUNT", db.sequelize.col("productos.id")),
          "cantidadProductos",
        ],
      ],
      group: ["Categoria.id"],
      order: [["nombre", "ASC"]],
    });
  });
  searchCategoriesByName = HandRepositoriesAsync(
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
          {
            model: Comercio,
            as: "comercio",
            attributes: ["id", "name", "logo"],
          },
          {
            model: Producto,
            as: "productos",
            attributes: [],
          },
        ],
        attributes: [
          "id",
          "nombre",
          "descripcion",
          "comercioId",
          [
            db.sequelize.fn("COUNT", db.sequelize.col("productos.id")),
            "cantidadProductos",
          ],
        ],
        group: ["Categoria.id"],
        order: [["nombre", "ASC"]],
      });
    }
  );
  createCategory = HandRepositoriesAsync(async (data) => {
    const comercio = await StoreRepository.findAll(data.comercioId);
    if (!comercio) {
      throw new Error("El comercio especificado no existe");
    }

    if (!comercio.activo) {
      throw new Error("No se puede crear categorías para un comercio inactivo");
    }

    return await StoreRepository.createCategory(data.comercioId, {
      nombre: data.nombre,
      descripcion: data.descripcion,
    });
  });
  updateCategory = HandRepositoriesAsync(async (id, data) => {
    const categoria = await super.findOne(id);
    if (!categoria) {
      throw new Error("Categoría no encontrada");
    }

    if (data.comercioId && data.comercioId !== categoria.comercioId) {
      const comercio = await StoreRepository.findAll(data.comercioId);
      if (!comercio) {
        throw new Error("El comercio especificado no existe");
      }

      if (!comercio.activo) {
        throw new Error(
          "No se puede asignar la categoría a un comercio inactivo"
        );
      }
    }

    return await super.update(id, data);
  });
  deleteCategory = HandRepositoriesAsync(async (id) => {
    const productos = await ProductsRepository.findAll({
      where: { categoriaId: id },
    });

    if (productos.length > 0) {
      throw new Error(
        "No se puede eliminar la categoría porque tiene productos asociados"
      );
    }

    return await super.delete(id);
  });
  getCategoriesByCommerceWithProducts = HandRepositoriesAsync(
    async (comercioId) => {
      return await super.findAll({
        where: { comercioId },
        include: [
          {
            model: Producto,
            as: "productos",
            attributes: ["id", "nombre", "precio", "imagen", "descripcion"],
          },
        ],
        order: [
          ["nombre", "ASC"],
          [{ model: Producto, as: "productos" }, "nombre", "ASC"],
        ],
      });
    }
  );
}

export default new CategoriesRepository();
