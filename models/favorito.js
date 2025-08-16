import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Favorito = sequelize.define("Favorito", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Usuarios",
        key: "id",
      },
    },
    comercioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Comercio",
        key: "id",
      },
    },
  });

  return Favorito;
};
