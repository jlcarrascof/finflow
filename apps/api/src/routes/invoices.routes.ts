import { Router } from 'express'
import { InvoicesController } from '../controllers/invoices.controller'
import { authGuard } from '../middlewares/auth.guard'

const router: Router = Router()

router.get('/',             authGuard, InvoicesController.getAll)
router.get('/:id',          authGuard, InvoicesController.getById)
router.post('/',            authGuard, InvoicesController.create)
router.patch('/:id/status', authGuard, InvoicesController.changeStatus)
router.delete('/:id',       authGuard, InvoicesController.remove)

export default router
