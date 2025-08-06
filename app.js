import "./config/ENV/config.js";
import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import multer from "multer";
import flash from 'connect-flash';
import session from 'express-session';

//Imports propios
import { projectRoot } from "./utils/Paths.js";
import UserMulter from "./config/multer/multer.js";
import context from "./config/context/AppContext.js";

import AuthenticationRoutes from './routes/AuthenticationRoutes.js';
import HomeRoutes from './routes/HomeRoutes.js';

const app = express();

app.engine(
  "hbs",
  engine({
    layoutsDir: "views/layouts",
    defaultLayout: "MainLayout",
    extname: ".hbs",
    helpers: {},
  })
);

//set view engine and views directory
app.set("view engine", "hbs");
app.set("views", "views");

//set static files an body parser
app.use(express.urlencoded());
app.use(express.static(path.join(projectRoot, "public")));


//Session config
//resave true guarda las sesiones aunque no se modifiquen, 
//save unitializaed, si hay ninguna seison creada el no la crea, la deja vacia(null), 
// si es true aunque no se haya logueado ya se le habra creado, y debe crearse al loguearse y confirmar
app.use(session({
    secret:process.env.SESSION_SECRET  || "anything",
    resave: false, 
    saveUninitialized: false }));

//flash
app.use(flash()); //inicializar flash

//local variables
app.use((req, res, next) => {
    const errors = req.flash("errors");
    const success = req.flash("success");
    //const sucess = req.flash("success");
    res.locals.errors = errors;
    res.locals.hasErrors = errors.length > 0;

    res.locals.success = success;
    res.locals.hasSuccess = success.length > 0;
    next();
});

//Routes
app.use(AuthenticationRoutes);
app.use(HomeRoutes);


//app.use(multer({ storage: UserMulter }).single("UserProfilePhoto"));

//404
app.use((req, res, next) => {
  res.status(404).render("404", { "page-title": "Not found" });
});

//DB Configs
try {
  await context.Sequelize.sync({ alter: process.env.PORT || false });
  app.listen(process.env.PORT || 8080);
  console.log(`The server is now running on port ${process.env.PORT || 5000}`);
} catch (error) {
  console.error("Error connecting to the database:", error);
}
