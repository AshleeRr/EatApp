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

export default router;
