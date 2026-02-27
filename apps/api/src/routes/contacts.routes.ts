import { Router } from 'express'
import { ContactsController } from '../controllers/contacts.controller'
import { authGuard } from '../middlewares/auth.guard'

const router: Router = Router()

router.get('/',     authGuard, ContactsController.getAll)
router.get('/:id',  authGuard, ContactsController.getById)
router.post('/',    authGuard, ContactsController.create)
router.put('/:id',  authGuard, ContactsController.update)
router.delete('/:id', authGuard, ContactsController.remove)

export default router


