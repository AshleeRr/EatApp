import { DataTypes } from "sequelize"

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
        model: "Comercios",
        key: "id",
      },
    },
  })

  Favorito.associate = (models) => {
    Favorito.belongsTo(models.Usuario, {
      foreignKey: "clienteId",
      as: "cliente",
    })

    Favorito.belongsTo(models.Comercio, {
      foreignKey: "comercioId",
      as: "comercio",
    })
  }

  return Favorito
}
