import db from "../config/context/AppContext.js";
import { HandRepositoriesAsync } from "../utils/handlers/handlerAsync.js";
import GenericRepository from "./genericRepository.js";
import { Op } from "sequelize";

const { Categoria, Comercio, Producto } = db;
const categoriesRepo = new GenericRepository(Categoria);
const comercioRepo = new GenericRepository(Comercio);

class CategoriesRepository {
  getAllCategories = HandRepositoriesAsync(async () => {
    return await Categoria.findAll({
      include: [
        {
          model: Comercio,
          as: "comercio",
          attributes: ["id", "name", "logo", "activo"],
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
  });

  getCategoryById = HandRepositoriesAsync(async (id) => {
    return await Categoria.findByPk(id, {
      include: [
        {
          model: Comercio,
          as: "comercio",
          attributes: ["id", "name", "logo", "activo"],
        },
        {
          model: Producto,
          as: "productos",
          attributes: ["id", "nombre", "precio", "imagen"],
        },
      ],
    });
  });

  getCategoriesByCommerce = HandRepositoriesAsync(async (comercioId) => {
    return await Categoria.findAll({
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

  getCategoriesByCommerceSimple = HandRepositoriesAsync(async (comercioId) => {
    return await Categoria.findAll({
      where: { comercioId },
      attributes: ["id", "nombre", "descripcion"],
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

      return await Categoria.findAll({
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
    const comercio = await Comercio.findByPk(data.comercioId);
    if (!comercio) {
      throw new Error("El comercio especificado no existe");
    }

    if (!comercio.activo) {
      throw new Error("No se puede crear categorías para un comercio inactivo");
    }

    return await comercioRepo.createCategory(data.comercioId, {
      nombre: data.nombre,
      descripcion: data.descripcion,
    });
  });

  updateCategory = HandRepositoriesAsync(async (id, data) => {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      throw new Error("Categoría no encontrada");
    }

    if (data.comercioId && data.comercioId !== categoria.comercioId) {
      const comercio = await Comercio.findByPk(data.comercioId);
      if (!comercio) {
        throw new Error("El comercio especificado no existe");
      }

      if (!comercio.activo) {
        throw new Error(
          "No se puede asignar la categoría a un comercio inactivo"
        );
      }
    }

    return await categoriesRepo.update(id, data);
  });

  deleteCategory = HandRepositoriesAsync(async (id) => {
    const productos = await Producto.findAll({
      where: { categoriaId: id },
    });

    if (productos.length > 0) {
      throw new Error(
        "No se puede eliminar la categoría porque tiene productos asociados"
      );
    }

    return await categoriesRepo.delete(id);
  });

  categoryExists = HandRepositoriesAsync(async (id) => {
    const categoria = await Categoria.findByPk(id);
    return !!categoria;
  });

  categoryBelongsToCommerce = HandRepositoriesAsync(
    async (categoryId, comercioId) => {
      const categoria = await Categoria.findOne({
        where: {
          id: categoryId,
          comercioId: comercioId,
        },
      });
      return !!categoria;
    }
  );

  categoryNameExistsInCommerce = HandRepositoriesAsync(
    async (nombre, comercioId, excludeId = null) => {
      const whereClause = {
        nombre: nombre,
        comercioId: comercioId,
      };

      if (excludeId) {
        whereClause.id = {
          [Op.ne]: excludeId,
        };
      }

      const categoria = await Categoria.findOne({
        where: whereClause,
      });
      return !!categoria;
    }
  );

  countCategoriesByCommerce = HandRepositoriesAsync(async (comercioId) => {
    return await Categoria.count({
      where: { comercioId },
    });
  });

  getCategoriesWithMostProducts = HandRepositoriesAsync(async (limit = 10) => {
    return await Categoria.findAll({
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
      having: db.sequelize.literal("COUNT(productos.id) > 0"),
      order: [
        [db.sequelize.fn("COUNT", db.sequelize.col("productos.id")), "DESC"],
      ],
      limit: limit,
    });
  });

  getCategoriesByCommerceWithProducts = HandRepositoriesAsync(
    async (comercioId) => {
      return await Categoria.findAll({
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

  moveProductsToCategory = HandRepositoriesAsync(
    async (fromCategoryId, toCategoryId) => {
      const fromCategory = await Categoria.findByPk(fromCategoryId);
      const toCategory = await Categoria.findByPk(toCategoryId);

      if (!fromCategory || !toCategory) {
        throw new Error("Una o ambas categorías no existen");
      }
      if (fromCategory.comercioId !== toCategory.comercioId) {
        throw new Error("Las categorías deben pertenecer al mismo comercio");
      }
      await Producto.update(
        { categoriaId: toCategoryId },
        { where: { categoriaId: fromCategoryId } }
      );

      return {
        fromCategory,
        toCategory,
        message: "Productos movidos exitosamente",
      };
    }
  );

  duplicateCategory = HandRepositoriesAsync(
    async (categoryId, newComercioId = null, newName = null) => {
      const categoria = await Categoria.findByPk(categoryId);
      if (!categoria) {
        throw new Error("Categoría no encontrada");
      }

      const targetComercioId = newComercioId || categoria.comercioId;
      const targetName = newName || `${categoria.nombre} - Copia`;

      const comercio = await Comercio.findByPk(targetComercioId);
      if (!comercio) {
        throw new Error("El comercio destino no existe");
      }

      const existingCategory = await this.categoryNameExistsInCommerce(
        targetName,
        targetComercioId
      );
      if (existingCategory) {
        throw new Error(
          "Ya existe una categoría con ese nombre en el comercio destino"
        );
      }

      return await this.createCategory({
        nombre: targetName,
        descripcion: categoria.descripcion,
        comercioId: targetComercioId,
      });
    }
  );

  getCategoriesStatistics = HandRepositoriesAsync(async () => {
    const totalCategories = await Categoria.count();

    const categoriesByCommerce = await Comercio.findAll({
      attributes: [
        "id",
        "name",
        [
          db.sequelize.fn("COUNT", db.sequelize.col("categorias.id")),
          "totalCategorias",
        ],
      ],
      include: [
        {
          model: Categoria,
          as: "categorias",
          attributes: [],
        },
      ],
      group: ["Comercio.id"],
      order: [
        [db.sequelize.fn("COUNT", db.sequelize.col("categorias.id")), "DESC"],
      ],
    });

    const categoriesWithProducts = await Categoria.count({
      include: [
        {
          model: Producto,
          as: "productos",
          required: true,
          attributes: [],
        },
      ],
    });

    const categoriesWithoutProducts = totalCategories - categoriesWithProducts;

    return {
      totalCategories,
      categoriesWithProducts,
      categoriesWithoutProducts,
      categoriesByCommerce,
    };
  });
}

export default CategoriesRepository;
