import express from "express";
import {
  index,
  createProductForm,
  createProduct,
  editProductForm,
  editProduct,
  deleteProduct,
} from "../controllers/ProductsController.js";

const router = express.Router();

router.get("/index", index);
router.get("/create", createProductForm);
router.post("/create", createProduct);
router.get("/edit/:id", editProductForm);
router.post("/edit/:id", editProduct);
router.post("/delete/:id", deleteProduct);

export default router;
