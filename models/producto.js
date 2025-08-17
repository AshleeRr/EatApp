import { DataTypes } from "sequelize";

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
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Categoria",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  });

  return Producto;
};
