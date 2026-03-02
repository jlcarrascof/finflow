import { Router } from 'express'
import { ReportsController } from '../controllers/reports.controller'
import { authGuard } from '../middlewares/auth.guard'

const router = Router()

router.use(authGuard)

/**
 * @openapi
 * /api/reports/summary:
 * get:
 * summary: Obtiene el resumen del dashboard financiero
 * description: Retorna los totales calculados por Prisma (facturas emitidas, pagadas y gastos aprobados).
 * tags: [Dashboard]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Resumen calculado con éxito
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * data:
 * type: object
 * properties:
 * totalInvoices:
 * type: integer
 * totalRevenue:
 * type: number
 * totalExpenses:
 * type: number
 * pendingInvoices:
 * type: integer
 * draftInvoices:
 * type: integer
 * 401:
 * description: No autorizado (Token faltante o inválido)
 */
router.get('/summary', ReportsController.getSummary)

export default router