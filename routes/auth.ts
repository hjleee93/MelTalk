import { Router } from 'express'
import { getAuthCallback, getOAuthPermission } from '../controllers/authController';
import { asyncHandler } from '../utils/errorHandler';

const router = Router();

router.get("/", asyncHandler(getOAuthPermission));

router.get("/callback",getAuthCallback);

export default router;
