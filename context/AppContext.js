import connection from "../utils/DbConnection.js";
import UserModel from "../models/UserModel.js"
import ClientModel from "../models/ClientModel.js";
import DeliveryModel from "../models/DeliveryModel.js";

try{
    await connection.authenticate();
    console.log("Database connection established successfully.");
}catch (error) {
    console.error("Unable to connect to the database due to:", error);
}

//relations
UserModel.hasMany(ClientModel,{foreignKey: "userId"});
ClientModel.belongsTo(UserModel,{foreignKey: "userId"});

UserModel.hasMany(DeliveryModel,{foreignKey: "userId"});
DeliveryModel.belongsTo(UserModel,{foreignKey: "userId"});

export default {
    Sequelize: connection,
    UserModel,
    ClientModel,
    DeliveryModel
};