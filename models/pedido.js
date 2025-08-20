import coneccion from "../config/connection/DbConnection.js";

import { DataTypes, Sequelize } from "sequelize";

const Pedido = coneccion.define(
  "Pedido",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: "pendiente",
      validate: {
        isIn: [["pendiente", "en proceso", "completado"]],
      },
    },

    fecha: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
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

    deliveryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Deliveries",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    direccionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Direccions",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "Pedidos",
  }
);
export default Pedido;
