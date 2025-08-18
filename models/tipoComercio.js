import coneccion from "../config/connection/DbConnection.js";

import { DataTypes } from "sequelize";

const TipoComercio = coneccion.define("TipoComercio", {
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
  icono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default TipoComercio;
