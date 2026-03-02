import { Router } from 'express'
import { PaymentsController } from '../controllers/payments.controller'
import { authGuard } from '../middlewares/auth.guard'

const router: Router = Router()

/**
 * @openapi
 * /api/payments:
 *   get:
 *     summary: Listar todos los pagos
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pagos
 *   post:
 *     summary: Registrar nuevo pago
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Pago registrado
 *
 * /api/payments/{id}:
 *   get:
 *     summary: Obtener pago por ID
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle del pago
 *
 * /api/payments/invoice/{invoiceId}:
 *   get:
 *     summary: Obtener pagos por ID de factura
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Historial de pagos asociados a la factura
 */

router.get('/',                   authGuard, PaymentsController.getAll)
router.get('/invoice/:invoiceId', authGuard, PaymentsController.getByInvoice)
router.get('/:id',                authGuard, PaymentsController.getById)
router.post('/',                  authGuard, PaymentsController.create)

export default router
