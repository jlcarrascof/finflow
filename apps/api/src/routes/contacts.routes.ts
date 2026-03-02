import { Router } from 'express'
import { ContactsController } from '../controllers/contacts.controller'
import { authGuard } from '../middlewares/auth.guard'

const router: Router = Router()

/**
 * @openapi
 * /api/contacts:
 *   get:
 *     summary: Listar contactos
 *     description: Obtiene el listado completo de clientes/proveedores.
 *     tags: [Contactos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de contactos obtenida con éxito
 *   post:
 *     summary: Crear contacto
 *     description: Añade un nuevo contacto a la base de datos.
 *     tags: [Contactos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               taxId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contacto creado exitosamente
 *
 * /api/contacts/{id}:
 *   get:
 *     summary: Obtener contacto por ID
 *     tags: [Contactos]
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
 *         description: Detalle del contacto
 *   put:
 *     summary: Actualizar contacto
 *     tags: [Contactos]
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
 *         description: Contacto actualizado
 *   delete:
 *     summary: Eliminar contacto
 *     tags: [Contactos]
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
 *         description: Contacto eliminado exitosamente
 */

router.get('/',     authGuard, ContactsController.getAll)
router.get('/:id',  authGuard, ContactsController.getById)
router.post('/',    authGuard, ContactsController.create)
router.put('/:id',  authGuard, ContactsController.update)
router.delete('/:id', authGuard, ContactsController.remove)

export default router
