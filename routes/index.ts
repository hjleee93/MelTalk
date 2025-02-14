import express from "express"
import testRouter from './test'

const router = express.Router();

router.use("/tests", testRouter);


export default router;