import { Router, Request, Response } from 'express'

const router: Router = Router()

interface Contact {
  id: number
  name: string
  email: string
  phone?: string
  type: 'client' | 'supplier'
  createdAt: string
  updatedAt: string
}

const mockContacts: Contact[] = [
  {
    id: 1,
    name: 'Empresa Demo S.A.',
    email: 'demo@empresa.com',
    phone: '+58 412 555 0001',
    type: 'client',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Proveedor Global C.A.',
    email: 'contacto@proveedor.com',
    phone: '+58 414 555 0002',
    type: 'supplier',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

router.get('/', (_req: Request, res: Response) => {
  res.json(mockContacts)
})

export default router

