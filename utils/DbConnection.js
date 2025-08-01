import Sequelize from "sequelize";
import { projectRoot} from "./Paths.js";
import path from "path";

let connection;

if( process.env.DB_DIALECT === "sqlite"){
    connection = new Sequelize("sqlite:db.sqlite",{
        dialect: process.env.DB_DIALECT,
        storage: path.join(
            projectRoot,
            process.env.DB_FOLDER,
            process.env.DB_FILENAME
        )
    });
}else if(process.env.DB_DIALECT === "mariadb"){
    connection = new Sequelize(
        process.env.DB_FILENAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            dialect: process.env.DB_DIALECT,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306
        }
    )
}else{
    throw new Error("Unsupported database dialect: " + process.env.DB_DIALECT);
}

export default connection;