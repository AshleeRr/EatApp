import { DataTypes } from "sequelize";

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
  });

  return Pedido;
};
