import StoreRoutes from "./StoreRoutes.js";
import ProductRoutes from "./ProductRoutes.js";
import CategoryRoutes from "./CategoryRoutes.js";
import PedidoRoutes from "./PedidoRoutes.js";

//
import express from "express";

const storeRoutes = express.Router();

storeRoutes.use("/", StoreRoutes);
storeRoutes.use("/product", ProductRoutes);
storeRoutes.use("/category", CategoryRoutes);
storeRoutes.use("/pedido", PedidoRoutes);

export default storeRoutes;
