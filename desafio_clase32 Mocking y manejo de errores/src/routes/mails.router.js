import { Router } from "express";
import { getbillController } from "../controllers/mails.controller.js";


const router = Router()

router.post('/getbill', getbillController)

export default router

// http://localhost:8080/mail/getbill