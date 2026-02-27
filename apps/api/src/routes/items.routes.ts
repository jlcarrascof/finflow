import { Router } from 'express'
import { ItemsController } from '../controllers/items.controller'
import { authGuard } from '../middlewares/auth.guard'

const router: Router = Router()

router.get('/',       authGuard, ItemsController.getAll)
router.get('/:id',    authGuard, ItemsController.getById)
router.post('/',      authGuard, ItemsController.create)
router.put('/:id',    authGuard, ItemsController.update)
router.delete('/:id', authGuard, ItemsController.remove)

export default router
