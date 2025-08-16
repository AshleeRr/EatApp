import { DataTypes } from "sequelize";

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
  });

  return DetallePedido;
};
