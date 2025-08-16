import connection from "../connection/DbConnection.js";
import { Sequelize } from "sequelize";
import path from "path";
import { projectRoot } from "../../utils/Paths.js";

// Import models
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
  logging: false,
});

try {
  await connection.authenticate();
  console.log("Database connection established successfully.");
} catch (error) {
  console.error("Unable to connect to the database due to:", error);
}

//models
const Comercio = ComercioModel(sequelize);
const TipoComercio = TipoComercioModel(sequelize);
const Categoria = CategoriaModel(sequelize);
const Producto = ProductoModel(sequelize);
const Pedido = PedidoModel(sequelize);
const DetallePedido = DetallePedidoModel(sequelize);
const Direccion = DireccionModel(sequelize);
const Configuracion = ConfiguracionModel(sequelize);
const Favorito = FavoritoModel(sequelize);
const Delivery = DeliveryModel(sequelize);
const Client = ClientModel(sequelize);
const User = UserModel(sequelize);

//relations
User.hasMany(Client, { foreignKey: "userId" });
Client.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Comercio, { foreignKey: "userId" });
Comercio.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Delivery, { foreignKey: "userId" });
Delivery.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Direccion, { foreignKey: "usuarioId", as: "direcciones" });
Direccion.belongsTo(User, { foreignKey: "usuarioId", as: "usuario" });

User.hasMany(Pedido, { foreignKey: "clienteId", as: "pedidosCliente" });
Pedido.belongsTo(User, { foreignKey: "clienteId", as: "cliente" });

User.hasMany(Pedido, { foreignKey: "deliveryId", as: "pedidosDelivery" });
Pedido.belongsTo(User, { foreignKey: "deliveryId", as: "delivery" });

TipoComercio.hasMany(Comercio, {
  foreignKey: "tipoComercioId",
  as: "comercio",
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

Comercio.hasMany(Pedido, { foreignKey: "comercioId", as: "pedidos" });
Pedido.belongsTo(Comercio, { foreignKey: "comercioId", as: "comercio" });

Configuracion.belongsTo(Pedido, {
  foreignKey: "configuracionId",
  as: "configuracion",
});

Direccion.hasMany(Pedido, { foreignKey: "direccionId", as: "pedidos" });
Pedido.belongsTo(Direccion, { foreignKey: "direccionId", as: "direccion" });

Pedido.hasMany(DetallePedido, { foreignKey: "pedidoId", as: "detalles" });
DetallePedido.belongsTo(Pedido, { foreignKey: "pedidoId", as: "pedido" });

DetallePedido.hasMany(Producto, { foreignKey: "productoId", as: "detalles" });
Producto.belongsTo(DetallePedido, {
  foreignKey: "DetallePedidoId",
  as: "producto",
});

User.hasMany(Favorito, {
  foreignKey: "clienteId",
  as: "favoritos",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Favorito.belongsTo(User, {
  foreignKey: "clienteId",
  as: "cliente",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Comercio.hasMany(Favorito, {
  foreignKey: "comercioId",
  as: "favoritos",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Favorito.belongsTo(Comercio, {
  foreignKey: "comercioId",
  as: "comercio",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

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
  Sequelize: connection,
  User,
  Client,
  Delivery,
};
