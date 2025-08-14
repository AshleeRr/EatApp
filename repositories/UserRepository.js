import db from "../config/context/AppContext.js";
import { HandRepositoriesAsync } from "../utils/handlers/handlerAsync.js";

const {
  Client,
  User,
  Direccion,
  Pedido,
  Favorito,
  Comercio,
  DetallePedido,
  Producto,
} = db;

class ClientRepository {
  getClienteByUserId = HandRepositoriesAsync(async (userId) => {
    return await Client.findOne({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ["id", "email", "role"],
        },
      ],
    });
  });

  getClienteCompleto = HandRepositoriesAsync(async (userId) => {
    return await Client.findOne({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ["id", "email", "role"],
          include: [
            {
              model: Direccion,
              as: "direcciones",
            },
          ],
        },
      ],
    });
  });

  getHistorialPedidos = HandRepositoriesAsync(async (userId, limite = 10) => {
    return await Pedido.findAll({
      where: { clienteId: userId },
      include: [
        {
          model: Comercio,
          as: "comercio",
          attributes: ["id", "nombre", "imagen"],
        },
        {
          model: DetallePedido,
          as: "detalles",
          include: [
            {
              model: Producto,
              as: "producto",
              attributes: ["id", "nombre", "precio", "imagen"],
            },
          ],
        },
        {
          model: Direccion,
          as: "direccion",
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: limite,
    });
  });

  getPedidosActivos = HandRepositoriesAsync(async (userId) => {
    return await Pedido.findAll({
      where: {
        clienteId: userId,
        estado: ["pendiente", "en_proceso", "en_camino"],
      },
      include: [
        {
          model: Comercio,
          as: "comercio",
          attributes: ["id", "nombre", "telefono"],
        },
        {
          model: DetallePedido,
          as: "detalles",
          include: [
            {
              model: Producto,
              as: "producto",
              attributes: ["id", "nombre", "precio"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  });

  getFavoritos = HandRepositoriesAsync(async (userId) => {
    return await Favorito.findAll({
      where: { clienteId: userId },
      include: [
        {
          model: Comercio,
          as: "comercio",
          attributes: ["id", "name", "logo"],
        },
      ],
    });
  });

  agregarFavorito = HandRepositoriesAsync(async (userId, comercioId) => {
    const favoritoExiste = await Favorito.findOne({
      where: { clienteId: userId, comercioId },
    });
    if (favoritoExiste) {
      throw new Error("El comercio ya está en favoritos");
    }
    return await Favorito.create({
      clienteId: userId,
      comercioId,
    });
  });

  removerFavorito = HandRepositoriesAsync(async (userId, comercioId) => {
    const resultado = await Favorito.destroy({
      where: { clienteId: userId, comercioId },
    });
    if (resultado === 0) {
      throw new Error("Favorito no encontrado");
    }
    return resultado;
  });

  getDirecciones = HandRepositoriesAsync(async (userId) => {
    return await Direccion.findAll({
      where: { usuarioId: userId },
      order: [["createdAt", "DESC"]],
    });
  });

  agregarDireccion = HandRepositoriesAsync(async (userId, datosDireccion) => {
    return await Direccion.create({
      ...datosDireccion,
      usuarioId: userId,
    });
  });

  actualizarCliente = HandRepositoriesAsync(
    async (userId, datosActualizacion) => {
      const cliente = await this.getClienteByUserId(userId);
      if (!cliente) throw new Error("Cliente no encontrado");
      return await cliente.update(datosActualizacion);
    }
  );

  getEstadisticasCliente = HandRepositoriesAsync(async (userId) => {
    const totalPedidos = await Pedido.count({
      where: { clienteId: userId },
    });
    const pedidosCompletados = await Pedido.count({
      where: {
        clienteId: userId,
        estado: "entregado",
      },
    });
    const totalFavoritos = await Favorito.count({
      where: { clienteId: userId },
    });
    const totalDirecciones = await Direccion.count({
      where: { usuarioId: userId },
    });
    return {
      totalPedidos,
      pedidosCompletados,
      totalFavoritos,
      totalDirecciones,
    };
  });
}

export default new ClientRepository();
