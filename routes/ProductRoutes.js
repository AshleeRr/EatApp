import express from "express";
import {
  index,
  createProductForm,
  createProduct,
  editProductForm,
  editProduct,
  deleteProduct,
} from "../controllers/ProductsController.js";

import isAuth from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/store/product/index", isAuth, index);
router.get("/store/product/create", isAuth, createProductForm);
router.post("/store/product/create", isAuth, createProduct);
router.get("/store/product/edit/:id", isAuth, editProductForm);
router.post("/store/product/edit/:id", isAuth, editProduct);
router.post("/store/product/delete/:id", isAuth, deleteProduct);

export default router;
