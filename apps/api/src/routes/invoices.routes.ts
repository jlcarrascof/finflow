import { Router } from 'express'
import { InvoicesController } from '../controllers/invoices.controller'
import { authGuard } from '../middlewares/auth.guard'

const router: Router = Router()

/**
 * @openapi
 * /api/invoices:
 *   get:
 *     summary: Listar facturas
 *     tags: [Facturas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de facturas
 *   post:
 *     summary: Crear factura
 *     tags: [Facturas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Factura creada exitosamente
 *
 * /api/invoices/{id}:
 *   get:
 *     summary: Obtener factura por ID
 *     tags: [Facturas]
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
 *         description: Detalle de la factura
 *   delete:
 *     summary: Eliminar factura
 *     tags: [Facturas]
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
 *         description: Factura eliminada
 *
 * /api/invoices/{id}/status:
 *   patch:
 *     summary: Cambiar estado de la factura
 *     tags: [Facturas]
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
 *         description: Estado de la factura actualizado
 */

router.get('/',             authGuard, InvoicesController.getAll)
router.get('/:id',          authGuard, InvoicesController.getById)
router.post('/',            authGuard, InvoicesController.create)
router.patch('/:id/status', authGuard, InvoicesController.changeStatus)
router.delete('/:id',       authGuard, InvoicesController.remove)

export default router
