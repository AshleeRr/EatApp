import coneccion from "../config/connection/DbConnection.js";

import { DataTypes } from "sequelize";

const Configuracion = coneccion.define("Configuracion", {
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

export default Configuracion;
