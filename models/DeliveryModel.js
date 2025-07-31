import connection from "../utils/DbConnection.js";

const DeliveryModel = connection.define("Deliveries",{
    id:{
        type: Datatypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true 
    },
    profilePhoto:{
        type: Datatypes.STRING,
        allowNull: false
    },
    name:{
        type: Datatypes.STRING,
        allowNull: false
    },
    lastName:{
        type: Datatypes.STRING,
        allowNull: false
    },
    userName:{
        type: Datatypes.STRING,
        allowNull: false
    },
    phoneNumber:{
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
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Users",
            key: "id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    }
},  {
        tableName: 'Deliveries',
    }
);

export default DeliveryModel;