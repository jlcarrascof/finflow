import { Router } from 'express'
import { ReportsController } from '../controllers/reports.controller'
import { authGuard } from '../middlewares/auth.guard'

const router = Router()

// Protegemos la ruta con el middleware de autenticación
router.use(authGuard)

router.get('/summary', ReportsController.getSummary)

export default router