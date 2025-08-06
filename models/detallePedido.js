import { DataTypes } from "sequelize"

export default (sequelize) => {
  const DetallePedido = sequelize.define("DetallePedido", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  })

  DetallePedido.associate = (models) => {
    DetallePedido.belongsTo(models.Pedido, {
      foreignKey: "pedidoId",
      as: "pedido",
    })

    DetallePedido.belongsTo(models.Producto, {
      foreignKey: "productoId",
      as: "producto",
    })
  }

  return DetallePedido
}
