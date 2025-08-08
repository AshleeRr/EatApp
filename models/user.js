import connection from "../config/connection/DbConnection.js";
import { DataTypes } from "sequelize";

const UserModel = connection.define("Users",{
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
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
    activateToken:{
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive:{
      type: DataTypes.STRING,
      defaultValue: false,
      allowNull: true
    }
  },
  {
    tableName: "Users",
  }
);

export default UserModel;
