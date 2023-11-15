import { Router } from "express"
import { mockingController } from "../controllers/mocking.controller.js"


const router = Router()

//Ruta para el Mock usando faker
router.get('/', mockingController)

export default router