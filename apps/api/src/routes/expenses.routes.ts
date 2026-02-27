import { Router } from 'express'
import { ExpensesController } from '../controllers/expenses.controller'
import { authGuard } from '../middlewares/auth.guard'

const router: Router = Router()

router.get('/',            authGuard, ExpensesController.getAll)
router.get('/:id',         authGuard, ExpensesController.getById)
router.post('/',           authGuard, ExpensesController.create)
router.put('/:id',         authGuard, ExpensesController.update)
router.patch('/:id/void',  authGuard, ExpensesController.voidExpense)
router.delete('/:id',      authGuard, ExpensesController.remove)

export default router
