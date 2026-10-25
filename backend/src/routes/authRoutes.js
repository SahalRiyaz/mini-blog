import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /auth/register - Public
router.post('/register', register);

// POST /auth/login - Public
router.post('/login', login);

// GET /auth/me - Authenticated
router.get('/me', requireAuth, getMe);

export default router;
