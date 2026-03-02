import { Router } from 'express'
import { ItemsController } from '../controllers/items.controller'
import { authGuard } from '../middlewares/auth.guard'

const router: Router = Router()

/**
 * @openapi
 * /api/items:
 *   get:
 *     summary: Listar productos/servicios
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de items obtenida con éxito
 *   post:
 *     summary: Crear item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Item creado exitosamente
 *
 * /api/items/{id}:
 *   get:
 *     summary: Obtener item por ID
 *     tags: [Items]
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
 *         description: Detalle del item
 *   put:
 *     summary: Actualizar item
 *     tags: [Items]
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
 *         description: Item actualizado
 *   delete:
 *     summary: Eliminar item
 *     tags: [Items]
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
 *         description: Item eliminado exitosamente
 */

router.get('/',       authGuard, ItemsController.getAll)
router.get('/:id',    authGuard, ItemsController.getById)
router.post('/',      authGuard, ItemsController.create)
router.put('/:id',    authGuard, ItemsController.update)
router.delete('/:id', authGuard, ItemsController.remove)

export default router
