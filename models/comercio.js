import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

export default (sequelize) => {
  const Comercio = sequelize.define(
    "Comercio",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      opening: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      closing: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      tipoComercioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "TipoComercios",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      tableName: "Comercio",
    }
  );
  return Comercio;
};
