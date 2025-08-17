import { DataTypes } from "sequelize";

export default (sequelize) => {
  const DetallePedido = sequelize.define("DetallePedido", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    pedidoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Pedidos",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Productos",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  });
  return DetallePedido;
};
