import connection from "../utils/DbConnection.js";

const UserModel = connection.define("Users",{
    id:{
        type: Datatypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true 
    },
    name:{
        type: Datatypes.STRING,
        allowNull: false
    },
    email:{
        type: Datatypes.STRING,
        allowNull: false
    },
    password:{
        type: Datatypes.STRING,
        allowNull: false
    },
    resetToken:{
        type: Datatypes.STRING,
        allowNull: true
    },
    resetTokenExp:{
        type: Datatypes.STRING,
        allowNull: true
    }
},  {
        tableName: "Users",
    }
);

export default UserModel;