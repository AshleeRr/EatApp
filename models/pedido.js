import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Pedido = sequelize.define(
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
        defaultValue: DataTypes.NOW,
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
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },

      direccionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Direccion",
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
  return Pedido;
};
