import { DataTypes } from "sequelize";

export default (sequelize) => {
  const UserModel = sequelize.define(
    "Users",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["client", "delivery", "store", "admin"]],
        },
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resetToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetTokenExp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      activateToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
    },
    {
      tableName: "Users",
    }
  );
  return UserModel;
};
