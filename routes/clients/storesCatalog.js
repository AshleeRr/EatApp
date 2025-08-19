import {
  index,
  addP,
  deleteP,
} from "../../controllers/clients/storeCatalogController.js";

import express from "express";

const router = express.Router();

router.get("/home/:id", index);
router.post("/add-product/:idProducto/shopping-car", addP);
router.post("/delete-product/:idProducto/shopping-car", deleteP);

export default router;
