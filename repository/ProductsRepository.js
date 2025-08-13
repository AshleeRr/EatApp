import db from "../config/context/AppContext.js";
import { HandRepositoriesAsync } from "../utils/handlers/handlerAsync.js";
import GenericRepository from "./genericRepository.js";
import { Op } from "sequelize";

const { Producto, Categoria, Comercio, DetallePedido } = db;
const productsRepo = new GenericRepository(Producto);

class ProductsRepository {
  getAllProducts = HandRepositoriesAsync(async () => {
    return await Producto.findAll({
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
    return await Producto.findByPk(id, {
      include: [
        { model: Categoria, as: "categoria" },
        {
          model: Comercio,
          as: "comercio",
          attributes: ["id", "name", "logo", "opening", "closing", "activo"],
        },
      ],
    });
  });

  getProductsByStore = HandRepositoriesAsync(async (comercioId) => {
    return await Producto.findAll({
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
      const productos = await Producto.findAll({
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

      const productosAgrupados = {};
      productos.forEach((producto) => {
        const categoriaNombre = producto.categoria?.nombre || "Sin categoría";
        if (!productosAgrupados[categoriaNombre]) {
          productosAgrupados[categoriaNombre] = [];
        }
        productosAgrupados[categoriaNombre].push(producto);
      });

      return productosAgrupados;
    }
  );

  getProductsByCategory = HandRepositoriesAsync(async (categoriaId) => {
    return await Producto.findAll({
      where: { categoriaId },
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
  });

  getProductsByCommerceForManagement = HandRepositoriesAsync(
    async (comercioId) => {
      return await Producto.findAll({
        where: { comercioId },
        include: [
          {
            model: Categoria,
            as: "categoria",
            attributes: ["id", "nombre"],
          },
        ],
        order: [["nombre", "ASC"]],
      });
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

      return await Producto.findAll({
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

  createProduct = HandRepositoriesAsync(async (data) => {
    return await productsRepo.create(data);
  });

  updateProduct = HandRepositoriesAsync(async (id, data) => {
    return await productsRepo.update(id, data);
  });

  deleteProduct = HandRepositoriesAsync(async (id) => {
    const detallesPedidos = await DetallePedido.findAll({
      where: { productoId: id },
    });

    if (detallesPedidos.length > 0) {
      throw new Error(
        "No se puede eliminar el producto porque tiene pedidos asociados"
      );
    }

    return await productsRepo.delete(id);
  });

  productExists = HandRepositoriesAsync(async (id) => {
    const producto = await Producto.findByPk(id);
    return !!producto;
  });

  productBelongsToStore = HandRepositoriesAsync(
    async (productId, comercioId) => {
      const producto = await Producto.findOne({
        where: {
          id: productId,
          comercioId: comercioId,
        },
      });
      return !!producto;
    }
  );

  countProductsByStore = HandRepositoriesAsync(async (comercioId) => {
    return await Producto.count({
      where: { comercioId },
    });
  });

  countProductsByCategory = HandRepositoriesAsync(async (categoriaId) => {
    return await Producto.count({
      where: { categoriaId },
    });
  });

  getMostSoldProducts = HandRepositoriesAsync(async (limit = 10) => {
    return await Producto.findAll({
      include: [
        {
          model: DetallePedido,
          as: "detallesPedido",
          attributes: [],
        },
        { model: Categoria, as: "categoria" },
        {
          model: Comercio,
          as: "comercio",
          attributes: ["id", "name", "logo"],
        },
      ],
      attributes: [
        "id",
        "nombre",
        "descripcion",
        "precio",
        "imagen",
        [
          db.sequelize.fn("COUNT", db.sequelize.col("detallesPedido.id")),
          "totalVentas",
        ],
      ],
      group: ["Producto.id"],
      order: [
        [
          db.sequelize.fn("COUNT", db.sequelize.col("detallesPedido.id")),
          "DESC",
        ],
      ],
      limit: limit,
    });
  });

  getProductsWithLowStock = HandRepositoriesAsync(async (minStock = 10) => {
    return await Producto.findAll({
      where: {
        stock: {
          [Op.lte]: minStock,
        },
      },
      include: [
        { model: Categoria, as: "categoria" },
        {
          model: Comercio,
          as: "comercio",
          attributes: ["id", "name", "logo"],
        },
      ],
      order: [["stock", "ASC"]],
    });
  });

  getProductsByPriceRange = HandRepositoriesAsync(
    async (minPrice, maxPrice, comercioId = null) => {
      const whereClause = {
        precio: {
          [Op.between]: [minPrice, maxPrice],
        },
      };

      if (comercioId) {
        whereClause.comercioId = comercioId;
      }

      return await Producto.findAll({
        where: whereClause,
        include: [
          { model: Categoria, as: "categoria" },
          {
            model: Comercio,
            as: "comercio",
            attributes: ["id", "name", "logo"],
          },
        ],
        order: [["precio", "ASC"]],
      });
    }
  );

  toggleProductStatus = HandRepositoriesAsync(async (id) => {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      throw new Error("Producto no encontrado");
    }

    const newStatus = !producto.activo;
    await producto.update({ activo: newStatus });

    return await this.getProductById(id);
  });

  getProductsStatistics = HandRepositoriesAsync(async () => {
    const totalProducts = await Producto.count();
    const activeProducts = await Producto.count({
      where: { activo: true },
    });
    const inactiveProducts = totalProducts - activeProducts;

    const productsByCategory = await Categoria.findAll({
      attributes: [
        "id",
        "nombre",
        [
          db.sequelize.fn("COUNT", db.sequelize.col("productos.id")),
          "totalProductos",
        ],
      ],
      include: [
        {
          model: Producto,
          as: "productos",
          attributes: [],
        },
      ],
      group: ["Categoria.id"],
    });

    return {
      totalProducts,
      activeProducts,
      inactiveProducts,
      productsByCategory,
    };
  });
}

export default ProductsRepository;
