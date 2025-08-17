import { DataTypes } from "sequelize";

export default (sequelize) => {
  const DeliveryModel = sequelize.define(
    "Deliveries",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      profilePhoto: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      estado: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "disponible",
        validate: {
          isIn: [["disponible", "ocupado"]],
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      tableName: "Deliveries",
    }
  );

  return DeliveryModel;
};
