import {
  index,
  CategoryIndex,
  editCategoryForm,
  editCategory,
  deleteCategory,
} from "../controllers/StoreController.js";
import express from "express";
import isAuth from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/store/index", isAuth, index);

//categories
router.get("/store/categories/index", isAuth, CategoryIndex);
router.get("/store/categories/create", isAuth, editCategoryForm);
router.post("/store/categories/create", isAuth, editCategory);
router.get("/store/categories/edit/:id", isAuth, editCategoryForm);
router.post("/store/categories/edit/:id", isAuth, editCategory);
router.post("/store/categories/delete/:id", isAuth, deleteCategory);

export default router;
