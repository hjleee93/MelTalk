import { Router } from 'express'
import { getAuthCallback, getOAuthPermission } from '../controllers/authController';

const router = Router();

router.get("/", getOAuthPermission);

router.get("/callback",getAuthCallback);

export default router;
