import express from 'express';
import { engine } from 'express-handlebars';
import context from './context/AppContext.js'; 
import path from 'path';

const app = express();

app.engine("hbs", engine({
    layoutsDir: "views/layouts",
    defaultLayout: "MainLayout",
    extname: ".hbs",
    helpers: {},
}));

app.set("view engine", "hbs");
app.set("views", "views");

//Routes


//404


//DB Configs
try{
    await context.Sequelize.sync({alter: process.env.PORT || false});
    app.listen(process.env.PORT || 8080);
    console.log(`The server is now running on port ${(process.env.PORT || 5000)}`);
}catch(error){
    console.error("Error connecting to the database:", error);
}