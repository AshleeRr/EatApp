import "./config/ENV/config.js";
import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import multer from "multer";

//Imports propios
import { projectRoot } from "./utils/Paths.js";
import UserMulter from "./config/multer/multer.js";
import context from "./config/context/AppContext.js";

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

app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.urlencoded());
app.use(express.static(path.join(projectRoot, "public")));

//Routes
app.use(multer({ storage: UserMulter }).single("UserProfilePhoto"));

//404
app.use((req, res, next) => {
  res.status(404).render("404", { "page.title": "Not found" });
});

//DB Configs
try {
  await context.Sequelize.sync({ alter: process.env.PORT || false });
  app.listen(process.env.PORT || 8080);
  console.log(`The server is now running on port ${process.env.PORT || 5000}`);
} catch (error) {
  console.error("Error connecting to the database:", error);
}
