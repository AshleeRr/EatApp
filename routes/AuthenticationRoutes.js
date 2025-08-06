import express from "express";
import {
  GetLogIn,
  PostLogIn,
  LogOut,
  GetForgotPassword,
  GetSignUpBussiness,
  PostSignUpBussiness,
  GetSignUpClient_Delivery,
  PostSignUpClient_Delivery,
  PostForgotPassword,
  GetResetPassword,
} from "../controllers/AuthenticationController.js";
import {
  saveProfilePhoto,
  saveBussinessLogo,
} from "../utils/handlers/FileHandler.js";

const router = express.Router();

router.get("/", GetLogIn);
router.post("/", PostLogIn);

router.get("/user/logOut", LogOut);

router.get("/user/signUp-client-delivery", GetSignUpClient_Delivery);
router.post(
  "/user/signUp-client-delivery",
  saveProfilePhoto.single("ProfilePhoto"),
  PostSignUpClient_Delivery
);

router.get("/user/signUp-bussiness", GetSignUpBussiness);
router.post(
  "/user/signUp-bussiness",
  saveBussinessLogo.single("BussinessLogo"),
  PostSignUpBussiness
);

router.get("/user/forgotPassword", GetForgotPassword);
router.post("/user/forgotPassword", PostForgotPassword);

router.get("/user/resetPassword", GetResetPassword);
router.post("/user/resetPassword", GetResetPassword);

export default router;
