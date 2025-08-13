import express from "express";
import { GetLogIn, GetActivate, PostLogIn, LogOut, GetForgotPassword, GetSignUpBusiness, PostSignUpBusiness, GetSignUpClient_Delivery, 
         PostSignUpClient_Delivery, PostForgotPassword, GetResetPassword, PostResetPassword} from "../controllers/AuthenticationController.js";

import { saveProfilePhoto, saveBusinessLogo} from "../utils/handlers/FileHandler.js";
import isAuthLogin from "../middlewares/isAuthForLogin.js"

const router = express.Router();

router.get("/", isAuthLogin, GetLogIn);
router.post("/", isAuthLogin, PostLogIn);

router.get("/user/logOut", LogOut);

router.get("/user/signUp-client-delivery",isAuthLogin, GetSignUpClient_Delivery);
router.post( "/user/signUp-client-delivery", isAuthLogin, saveProfilePhoto.single("ProfilePhoto"), PostSignUpClient_Delivery
);

router.get("/user/signUp-business", isAuthLogin, GetSignUpBusiness);
router.post("/user/signUp-business", isAuthLogin, saveBusinessLogo.single("BusinessLogo"), PostSignUpBusiness);

router.get("/user/forgotPassword",isAuthLogin, GetForgotPassword);
router.post("/user/forgotPassword", isAuthLogin, PostForgotPassword);

router.get("/user/resetPassword/:token", isAuthLogin, GetResetPassword);
router.post("/user/resetPassword", isAuthLogin, PostResetPassword);

router.get("/user/activate/:token", GetActivate);

export default router;
