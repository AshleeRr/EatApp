import {
  index,
  createForm,
  create,
  editForm,
  edit,
  deleteA,
} from "../../controllers/admins/AdminController.js";

import express from "express";

const router = express.Router();

router.get("/home", index);

router.get("/create", createForm);
router.post("/create", create);

router.get("/edit/:id", editForm);
router.post("/edit/:id", edit);

router.post("/delete/:id", deleteA);

export default router;
