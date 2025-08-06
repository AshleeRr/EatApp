import { DataTypes } from "sequelize"

export default (sequelize) => {
  const Configuracion = sequelize.define("Configuracion", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    itbis: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 18.0,
    },
  })

  return Configuracion
}
