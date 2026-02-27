import type { Request, Response, NextFunction } from 'express'
import { ExpensesService } from '../services/expenses.service'
import { CreateExpenseSchema, UpdateExpenseSchema, VoidExpenseSchema } from '../dtos/expense.dto'

export const ExpensesController = {

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const expenses = await ExpensesService.findAll()
      res.json({ data: expenses, total: expenses.length })
    } catch (err) {
      next(err)
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id      = Number(req.params.id)
      const expense = await ExpensesService.findById(id)
      if (!expense) {
        res.status(404).json({ message: 'Gasto no encontrado' })
        return
      }
      res.json({ data: expense })
    } catch (err) {
      next(err)
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = CreateExpenseSchema.safeParse(req.body)
      if (!parsed.success) {
        res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten() })
        return
      }
      const userId  = (req as any).user.id
      const expense = await ExpensesService.create(parsed.data, userId)
      res.status(201).json({ data: expense })
    } catch (err) {
      next(err)
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id     = Number(req.params.id)
      const parsed = UpdateExpenseSchema.safeParse(req.body)
      if (!parsed.success) {
        res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten() })
        return
      }
      const expense = await ExpensesService.update(id, parsed.data)
      res.json({ data: expense })
    } catch (err) {
      next(err)
    }
  },

  async voidExpense(req: Request, res: Response, next: NextFunction) {
    try {
      const id     = Number(req.params.id)
      const parsed = VoidExpenseSchema.safeParse(req.body)
      if (!parsed.success) {
        res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten() })
        return
      }
      const expense = await ExpensesService.void(id, parsed.data)
      res.json({ data: expense })
    } catch (err) {
      next(err)
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id      = Number(req.params.id)
      const expense = await ExpensesService.findById(id)
      if (!expense) {
        res.status(404).json({ message: 'Gasto no encontrado' })
        return
      }
      if (expense.status !== 'pending') {
        res.status(409).json({ message: 'Solo se pueden eliminar gastos en estado pendiente' })
        return
      }
      await ExpensesService.delete(id)
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  },
}
