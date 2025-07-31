import express from 'express';
import { GetLogIn } from '../controllers/AuthenticationController.js';

const router = express.Router();

router.get('/', GetLogIn);

export default router;