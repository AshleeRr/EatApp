import coneccion from "../config/connection/DbConnection.js";

import { DataTypes } from "sequelize";

const Categoria = coneccion.define("Categoria", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  comercioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Comercio",
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
});

export default Categoria;
