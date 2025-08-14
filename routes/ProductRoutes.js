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

router.get("/product/index", index);
router.get("/product/create", createProductForm);
router.post("/product/create", createProduct);
router.get("/product/edit/:id", editProductForm);
router.post("/product/edit/:id", editProduct);
router.post("/product/delete/:id", deleteProduct);

export default router;
