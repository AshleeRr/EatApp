import connection from "../utils/DbConnection.js";
import { DataTypes } from "sequelize";

const UserModel = connection.define("Users",{
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true 
    },
    role: {
        type: DataTypes.ENUM("client", "delivery", "store", "admin"),
        allowNull: false    
    },
    userName:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    resetToken:{
        type: DataTypes.STRING,
        allowNull: true
    },
    resetTokenExp:{
        type: DataTypes.STRING,
        allowNull: true
    }
},  {
        tableName: "Users",
    }
);

export default UserModel;