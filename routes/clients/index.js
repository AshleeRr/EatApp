import storeCatalog from "./storesCatalog.js";
import clientHome from "./ClientRoutes.js";
import clientDirections from "./DirectionsRoutes.js";
import orderProcess from "./orderRoutes.js";
import showHistory from "./historyRoutes.js";
import express from "express";

const client = express.Router();

client.use("/", clientHome);
client.use("/directions", clientDirections);
client.use("/store", storeCatalog);
client.use("/order", orderProcess);
client.use("/history", showHistory);

export default client;
