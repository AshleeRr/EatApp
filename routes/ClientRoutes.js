import express from 'express';
import { GetProfile, GetDirections, GetHome } from '../controllers/ClientController.js';


import isAuth from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get('/home', isAuth, GetHome);
router.get('/profile',isAuth, GetProfile); 
router.get('/directions',isAuth, GetDirections); 

export default router;
