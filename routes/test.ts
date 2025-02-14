import express from "express"
import { getTests } from '../controllers/testController'
import { testMiddleware } from "../middlewares/testMiddleware";
const router = express.Router();

router.get("/", testMiddleware, getTests);


export default router;
