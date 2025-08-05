import "./utils/LoadEnvConfig.js";
import express from 'express';
import { engine } from 'express-handlebars';
import context from './context/AppContext.js'; 
import path from 'path';
import AuthenticationRoutes from './routes/AuthenticationRoutes.js';
import HomeRoutes from './routes/HomeRoutes.js';
import { projectRoot } from './utils/Paths.js';

const app = express();

app.engine("hbs", engine({
    layoutsDir: "views/layouts",
    defaultLayout: "MainLayout",
    extname: ".hbs",
    helpers: {},
}));

app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.urlencoded());
app.use(express.static(path.join(projectRoot, "public")));

//Routes
app.use(AuthenticationRoutes);
app.use(HomeRoutes);

//404


//DB Configs
try{
    await context.Sequelize.sync({alter: process.env.PORT || false});
    app.listen(process.env.PORT || 8080);
    console.log(`The server is now running on port ${(process.env.PORT || 5000)}`);
}catch(error){
    console.error("Error connecting to the database:", error);
}