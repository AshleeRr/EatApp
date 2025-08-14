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

router.get("/product/index", isAuth, index);
router.get("/product/create", isAuth, createProductForm);
router.post("/product/create", isAuth, createProduct);
router.get("/product/edit/:id", isAuth, editProductForm);
router.post("/product/edit/:id", isAuth, editProduct);
router.post("/product/delete/:id", isAuth, deleteProduct);

export default router;
