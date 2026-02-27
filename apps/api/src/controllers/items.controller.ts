import type { Request, Response, NextFunction } from 'express'
import { ItemsService } from '../services/items.service'
import { CreateItemSchema, UpdateItemSchema } from '../dtos/item.dto'

export const ItemsController = {

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const items = await ItemsService.findAll()
      res.json({ data: items, total: items.length })
    } catch (err) {
      next(err)
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id   = Number(req.params.id)
      const item = await ItemsService.findById(id)
      if (!item) {
        res.status(404).json({ message: 'Item no encontrado' })
        return
      }
      res.json({ data: item })
    } catch (err) {
      next(err)
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = CreateItemSchema.safeParse(req.body)
      if (!parsed.success) {
        res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten() })
        return
      }
      const item = await ItemsService.create(parsed.data)
      res.status(201).json({ data: item })
    } catch (err) {
      next(err)
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id     = Number(req.params.id)
      const parsed = UpdateItemSchema.safeParse(req.body)
      if (!parsed.success) {
        res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten() })
        return
      }
      const item = await ItemsService.update(id, parsed.data)
      res.json({ data: item })
    } catch (err) {
      next(err)
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      await ItemsService.delete(id)
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  },
}
