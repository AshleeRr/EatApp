import express from "express";
import {
  index,
  createCategoryForm,
  createCategory,
  editCategoryForm,
  editCategory,
  deleteCategory,
} from "../controllers/CategoryController.js";

const router = express.Router();

router.get("/store/categories/index", index);
router.get("/store/categories/create", createCategoryForm);
router.post("/store/categories/create", createCategory);
router.get("/store/categories/edit/:id", editCategoryForm);
router.post("/store/categories/edit/:id", editCategory);
router.post("/store/categories/delete/:id", deleteCategory);

export default router;
