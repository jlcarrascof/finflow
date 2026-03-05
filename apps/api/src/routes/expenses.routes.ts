import { Router } from 'express'
import { ExpensesController } from '../controllers/expenses.controller'
import { authGuard } from '../middlewares/auth.guard'

const router: Router = Router()

/**
 * @openapi
 * /api/expenses:
 *   get:
 *     summary: Listar gastos
 *     tags: [Gastos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de gastos
 *   post:
 *     summary: Crear gasto
 *     tags: [Gastos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Gasto registrado exitosamente
 *
 * /api/expenses/{id}:
 *   get:
 *     summary: Obtener gasto por ID
 *     tags: [Gastos]
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
 *         description: Detalle del gasto
 *   put:
 *     summary: Actualizar gasto
 *     tags: [Gastos]
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
 *         description: Gasto actualizado
 *   delete:
 *     summary: Eliminar gasto
 *     tags: [Gastos]
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
 *         description: Gasto eliminado físicamente
 *
 * /api/expenses/{id}/void:
 *   patch:
 *     summary: Anular gasto
 *     tags: [Gastos]
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
 *         description: Gasto marcado como anulado (void)
 */


router.get('/',            authGuard, ExpensesController.getAll)
router.get('/:id',         authGuard, ExpensesController.getById)
router.post('/',           authGuard, ExpensesController.create)
router.put('/:id',         authGuard, ExpensesController.update)
router.patch('/:id/void',  authGuard, ExpensesController.voidExpense)
router.delete('/:id',      authGuard, ExpensesController.remove)

export default router
