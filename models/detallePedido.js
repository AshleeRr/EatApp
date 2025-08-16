import { DataTypes } from "sequelize";

export default (sequelize) => {
  const DetallePedido = sequelize.define("DetallePedido", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  });

  return DetallePedido;
};
