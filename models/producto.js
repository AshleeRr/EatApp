import { DataTypes } from "sequelize"

export default (sequelize) => {
  const Producto = sequelize.define("Producto", {
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
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  })

  Producto.associate = (models) => {
    Producto.belongsTo(models.Comercio, {
      foreignKey: "comercioId",
      as: "comercio",
    })

    Producto.belongsTo(models.Categoria, {
      foreignKey: "categoriaId",
      as: "categoria",
    })

    Producto.hasMany(models.DetallePedido, {
      foreignKey: "productoId",
      as: "detallesPedido",
    })
  }

  return Producto
}
