import homeRoutes from "./homeRoutes.js";
import adminRoutes from "./adminRoutes.js";
import configRoutes from "./configRoutes.js";
import storesTypesRoutes from "./storesTypesRoutes.js";

import express from "express";

const storeRoutes = express.Router();

storeRoutes.use("/dashboard", homeRoutes);
storeRoutes.use("/admins", adminRoutes);
storeRoutes.use("/configurations", configRoutes);
storeRoutes.use("/storesTypes", storesTypesRoutes);

export default storeRoutes;
