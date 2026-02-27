import { Router } from 'express'
import { PaymentsController } from '../controllers/payments.controller'
import { authGuard } from '../middlewares/auth.guard'

const router: Router = Router()

router.get('/',                   authGuard, PaymentsController.getAll)
router.get('/invoice/:invoiceId', authGuard, PaymentsController.getByInvoice)
router.get('/:id',                authGuard, PaymentsController.getById)
router.post('/',                  authGuard, PaymentsController.create)

export default router
