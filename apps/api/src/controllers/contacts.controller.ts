import type { Request, Response } from 'express'
import { ContactsService } from '../services/contacts.service'
import { CreateContactSchema, UpdateContactSchema } from '../dtos/contact.dto'

export const ContactsController = {
  async getAll(req: Request, res: Response) {
    const contacts = await ContactsService.findAll()
    res.json({ data: contacts, total: contacts.length })
  },

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id)
    const contact = await ContactsService.findById(id)
    if (!contact) {
      res.status(404).json({ message: 'Contacto no encontrado' })
      return
    }
    res.json({ data: contact })
  },

  async create(req: Request, res: Response) {
    const parsed = CreateContactSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten() })
      return
    }
    const contact = await ContactsService.create(parsed.data)
    res.status(201).json({ data: contact })
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id)
    const parsed = UpdateContactSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten() })
      return
    }
    const contact = await ContactsService.update(id, parsed.data)
    res.json({ data: contact })
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id)
    await ContactsService.delete(id)
    res.status(204).send()
  },
}
