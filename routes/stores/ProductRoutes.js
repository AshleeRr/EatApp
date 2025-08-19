import express from "express";
import {
  index,
  createProductForm,
  createProduct,
  editProductForm,
  editProduct,
  deleteProduct,
} from "../../controllers/stores/ProductsController.js";

import { saveProductsImgs } from "../../utils/handlers/FileHandler.js";

const router = express.Router();

router.get("/index", index);
router.get("/create", createProductForm);
router.post("/create", saveProductsImgs.single("imagen"), createProduct);
router.get("/edit/:id", editProductForm);
router.post("/edit/:id", saveProductsImgs.single("imagen"), editProduct);
router.post("/delete", deleteProduct);

export default router;
