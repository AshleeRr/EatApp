import { DataTypes } from "sequelize"

export default (sequelize) => {
  const Direccion = sequelize.define("Direccion", {
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
  })

  Direccion.associate = (models) => {
    Direccion.belongsTo(models.Usuario, {
      foreignKey: "usuarioId",
      as: "usuario",
    })

    Direccion.hasMany(models.Pedido, {
      foreignKey: "direccionId",
      as: "pedidos",
    })
  }

  return Direccion
}
