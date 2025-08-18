import coneccion from "../config/connection/DbConnection.js";

import { DataTypes } from "sequelize";

const Favorito = coneccion.define("Favorito", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Clients",
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
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

export default Favorito;
