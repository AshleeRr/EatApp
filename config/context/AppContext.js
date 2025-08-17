import { Sequelize, DataTypes } from "sequelize";
import path from "path";
import { projectRoot } from "../../utils/Paths.js";

import ComercioModel from "../../models/comercio.js";
import TipoComercioModel from "../../models/tipoComercio.js";
import CategoriaModel from "../../models/categoria.js";
import ProductoModel from "../../models/producto.js";
import PedidoModel from "../../models/pedido.js";
import DetallePedidoModel from "../../models/detallePedido.js";
import DireccionModel from "../../models/direccion.js";
import ConfiguracionModel from "../../models/configuracion.js";
import FavoritoModel from "../../models/favorito.js";
import UserModel from "../../models/user.js";
import ClientModel from "../../models/client.js";
import DeliveryModel from "../../models/delivery.js";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(projectRoot, "config", "DB", "EatApp.sqlite"),
  logging: console.log,
});

try {
  await sequelize.authenticate();
  console.log("Coneccion establecida");
} catch (error) {
  console.error("No se pudo conectar a la base de datos", error);
}

const models = {
  User: UserModel(sequelize, DataTypes),
  Client: ClientModel(sequelize, DataTypes),
  Comercio: ComercioModel(sequelize, DataTypes),
  TipoComercio: TipoComercioModel(sequelize, DataTypes),
  Categoria: CategoriaModel(sequelize, DataTypes),
  Producto: ProductoModel(sequelize, DataTypes),
  Pedido: PedidoModel(sequelize, DataTypes),
  DetallePedido: DetallePedidoModel(sequelize, DataTypes),
  Direccion: DireccionModel(sequelize, DataTypes),
  Configuracion: ConfiguracionModel(sequelize, DataTypes),
  Favorito: FavoritoModel(sequelize, DataTypes),
  Delivery: DeliveryModel(sequelize, DataTypes),
};

const {
  User,
  Client,
  Comercio,
  TipoComercio,
  Categoria,
  Producto,
  Pedido,
  DetallePedido,
  Direccion,
  Favorito,
  Delivery,
  Configuracion,
} = models;

User.hasMany(Client, { foreignKey: "userId" });
Client.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Comercio, { foreignKey: "userId" });
Comercio.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Delivery, { foreignKey: "userId" });
Delivery.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Direccion, { foreignKey: "usuarioId", as: "direcciones" });
Direccion.belongsTo(User, { foreignKey: "usuarioId", as: "usuario" });

Pedido.belongsTo(Client, { foreignKey: "clienteId", as: "cliente" });
Pedido.belongsTo(Comercio, { foreignKey: "comercioId", as: "comercio" });
Pedido.belongsTo(Delivery, { foreignKey: "deliveryId", as: "delivery" });
Pedido.belongsTo(Direccion, { foreignKey: "direccionId", as: "direccion" });

Client.hasMany(Pedido, { foreignKey: "clienteId", as: "pedidosCliente" });
Comercio.hasMany(Pedido, { foreignKey: "comercioId", as: "pedidos" });
Delivery.hasMany(Pedido, { foreignKey: "deliveryId", as: "pedidosDelivery" });
Direccion.hasMany(Pedido, {
  foreignKey: "direccionId",
  as: "pedidosDireccion",
});

TipoComercio.hasMany(Comercio, {
  foreignKey: "tipoComercioId",
  as: "comercios",
});
Comercio.belongsTo(TipoComercio, {
  foreignKey: "tipoComercioId",
  as: "tipoComercio",
});

Comercio.hasMany(Categoria, { foreignKey: "comercioId", as: "categorias" });
Categoria.belongsTo(Comercio, { foreignKey: "comercioId", as: "comercio" });

Comercio.hasMany(Producto, { foreignKey: "comercioId", as: "productos" });
Producto.belongsTo(Comercio, { foreignKey: "comercioId", as: "comercio" });

Categoria.hasMany(Producto, { foreignKey: "categoriaId", as: "productos" });
Producto.belongsTo(Categoria, { foreignKey: "categoriaId", as: "categoria" });

Pedido.hasMany(DetallePedido, { foreignKey: "pedidoId", as: "detalles" });
DetallePedido.belongsTo(Pedido, { foreignKey: "pedidoId", as: "pedido" });

DetallePedido.belongsTo(Producto, { foreignKey: "productoId", as: "producto" });
Producto.hasMany(DetallePedido, { foreignKey: "productoId", as: "detalles" });

Comercio.hasMany(Favorito, { foreignKey: "comercioId", as: "favoritos" });
Favorito.belongsTo(Comercio, { foreignKey: "comercioId", as: "comercio" });

export default {
  Comercio,
  TipoComercio,
  Categoria,
  Producto,
  Pedido,
  DetallePedido,
  Direccion,
  Configuracion,
  Favorito,
  sequelize,
  Sequelize: sequelize,
  User,
  Client,
  Delivery,
};
