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

router.get("/index", index);
router.get("/create", createCategoryForm);
router.post("/create", createCategory);
router.get("/edit/:id", editCategoryForm);
router.post("/edit/:id", editCategory);
router.post("/delete/:id", deleteCategory);

export default router;
