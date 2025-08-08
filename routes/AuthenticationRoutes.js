import express from "express";
import { GetLogIn, PostLogIn, LogOut, GetForgotPassword, GetSignUpBussiness, PostSignUpBussiness, GetSignUpClient_Delivery, 
         PostSignUpClient_Delivery, PostForgotPassword, GetResetPassword, PostResetPassword} from "../controllers/AuthenticationController.js";

import { saveProfilePhoto, saveBussinessLogo} from "../utils/handlers/FileHandler.js";
import isAuthLogin from "../middlewares/isAuthLogIn.js"
const router = express.Router();

router.get("/", isAuthLogin, GetLogIn);
router.post("/", isAuthLogin, PostLogIn);

router.get("/user/logOut", LogOut);

router.get("/user/signUp-client-delivery",isAuthLogin, GetSignUpClient_Delivery);
router.post( "/user/signUp-client-delivery", isAuthLogin, saveProfilePhoto.single("ProfilePhoto"), PostSignUpClient_Delivery
);

router.get("/user/signUp-bussiness", isAuthLogin, GetSignUpBussiness);
router.post("/user/signUp-bussiness", isAuthLogin, saveBussinessLogo.single("BussinessLogo"), PostSignUpBussiness);

router.get("/user/forgotPassword",isAuthLogin, GetForgotPassword);
router.post("/user/forgotPassword", isAuthLogin, PostForgotPassword);

router.get("/user/resetPassword/:token", isAuthLogin, GetResetPassword);
router.post("/user/resetPassword", isAuthLogin, PostResetPassword);



export default router;
