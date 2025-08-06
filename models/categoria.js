import { DataTypes } from "sequelize"

export default (sequelize) => {
  const Categoria = sequelize.define("Categoria", {
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

  Categoria.associate = (models) => {
    Categoria.belongsTo(models.Comercio, {
      foreignKey: "comercioId",
      as: "comercio",
    })

    Categoria.hasMany(models.Producto, {
      foreignKey: "categoriaId",
      as: "productos",
    })
  }

  return Categoria
}
