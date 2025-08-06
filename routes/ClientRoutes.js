import express from 'express';
import { GetIndex } from '../controllers/ClientController.js';

const router = express.Router();

router.get('/index', GetIndex);

export default router;