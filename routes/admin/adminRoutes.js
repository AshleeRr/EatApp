import {
  index,
  createForm,
  create,
  editForm,
  edit,
  deleteA,
} from "../../controllers/admin/AdminController.js";

import express from "express";

const router = express.Router();

router.get("/home", index);

router.get("/create", createForm);
router.post("/create", create);

router.get("/edit/:id", editForm);
router.post("/edit", editForm);

router.post("/delete/:id", deleteA);

export default router;
