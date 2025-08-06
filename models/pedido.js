import { DataTypes } from "sequelize"

export default (sequelize) => {
  const Pedido = sequelize.define("Pedido", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "en proceso", "completado"),
      defaultValue: "pendiente",
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  })

  Pedido.associate = (models) => {
    Pedido.belongsTo(models.Usuario, {
      foreignKey: "clienteId",
      as: "cliente",
    })

    Pedido.belongsTo(models.Usuario, {
      foreignKey: "deliveryId",
      as: "delivery",
    })

    Pedido.belongsTo(models.Comercio, {
      foreignKey: "comercioId",
      as: "comercio",
    })

    Pedido.belongsTo(models.Direccion, {
      foreignKey: "direccionId",
      as: "direccion",
    })

    Pedido.hasMany(models.DetallePedido, {
      foreignKey: "pedidoId",
      as: "detalles",
    })
  }

  return Pedido
}
