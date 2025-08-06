import { DataTypes } from "sequelize"

export default (sequelize) => {
  const TipoComercio = sequelize.define("TipoComercio", {
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
  })

  TipoComercio.associate = (models) => {
    TipoComercio.hasMany(models.Comercio, {
      foreignKey: "tipoComercioId",
      as: "comercios",
    })
  }

  return TipoComercio
}
