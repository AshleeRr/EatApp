import express from "express";
import {
  index,
  createCategoryForm,
  createCategory,
  editCategoryForm,
  editCategory,
  deleteCategory,
} from "../controllers/CategoryController.js";

import isAuth from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/store/categories/index", isAuth, index);
router.get("/store/categories/create", isAuth, createCategoryForm);
router.post("/store/categories/create", isAuth, createCategory);
router.get("/store/categories/edit/:id", isAuth, editCategoryForm);
router.post("/store/categories/edit/:id", isAuth, editCategory);
router.post("/store/categories/delete/:id", isAuth, deleteCategory);

export default router;
