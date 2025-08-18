import connection from "../connection/DbConnection.js";

//models
import Admin from "../../models/admin.js";
import Comercio from "../../models/comercio.js";
import TipoComercio from "../../models/tipoComercio.js";
import Categoria from "../../models/categoria.js";
import Producto from "../../models/producto.js";
import Pedido from "../../models/pedido.js";
import DetallePedido from "../../models/detallePedido.js";
import Direccion from "../../models/direccion.js";
import Configuracion from "../../models/configuracion.js";
import Favorito from "../../models/favorito.js";
import User from "../../models/user.js";
import Client from "../../models/client.js";
import Delivery from "../../models/delivery.js";

User.hasMany(Client, { foreignKey: "userId" });
Client.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Comercio, { foreignKey: "userId" });
Comercio.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Delivery, { foreignKey: "userId" });
Delivery.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Admin, { foreignKey: "userId" });
Admin.belongsTo(User, { foreignKey: "userId" });

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
Client.hasMany(Favorito, { foreignKey: "clienteId", as: "favoritos" });
Favorito.belongsTo(Client, { foreignKey: "clienteId", as: "cliente" });

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
  User,
  Client,
  Delivery,
  Admin,
  sequelize: connection,
};
