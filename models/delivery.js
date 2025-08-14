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
        type: DataTypes.ENUM("disponible", "ocupado"),
        allowNull: false,
        defaultValue: "disponible",
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

  DeliveryModel.associate = (models) => {
    DeliveryModel.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    DeliveryModel.hasMany(models.Pedido, {
      foreignKey: "deliveryId",
      as: "pedidos",
    });
  };

  return DeliveryModel;
};
