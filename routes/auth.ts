import { Router } from 'express'
import AuthController from '../controllers/authController';
import { asyncHandler } from '../utils/errorHelper';

const router = Router();

router.get("/", asyncHandler(AuthController.getOAuthPermission));

router.get("/callback",AuthController.getAuthCallback);

export default router;
