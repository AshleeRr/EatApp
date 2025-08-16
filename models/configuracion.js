import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Configuracion = sequelize.define("Configuracion", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
  });

  return Configuracion;
};
