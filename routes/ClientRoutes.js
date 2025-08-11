
import express from 'express';
//import { GetIndex } from '../controllers/ClientController.js';

import isAuth from "../middlewares/isAuthenticated.js";

const router = express.Router();

//router.get('/home',isAuth, GetIndex); //isAuth A Todas las rutas

export default router;
