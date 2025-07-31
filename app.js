import express from 'express';
import { engine } from 'express-handlebars';
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