import express from 'express';
import { GetIndex } from '../controllers/HomeController.js';

const router = express.Router();

router.get('/', GetIndex);

export default router;