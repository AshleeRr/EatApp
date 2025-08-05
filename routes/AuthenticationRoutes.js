import express from 'express';
import { GetLogIn, GetForgotPassword, GetSignUpBussiness, PostSignUpBussiness, GetSignUpClient_Delivery, PostForgotPassword, GetResetPassword } from '../controllers/AuthenticationController.js';

const router = express.Router();

router.get('/', GetLogIn);

router.get('/user/signUp-client-delivery', GetSignUpClient_Delivery);
router.post('/user/signUp-client-delivery', GetSignUpClient_Delivery);

router.get('/user/signUp-bussiness', GetSignUpBussiness);
router.post('/user/signUp-bussiness', PostSignUpBussiness);

router.get('/user/forgotPassword', GetForgotPassword);
router.post('/user/forgotPassword', PostForgotPassword);

router.get('/user/resetPassword', GetResetPassword);
router.post('/user/resetPassword', GetResetPassword);


export default router;