import type { Request, Response, NextFunction } from 'express'
import { InvoicesService } from '../services/invoices.service'
import { CreateInvoiceSchema, VoidInvoiceSchema } from '../dtos/invoice.dto'

export const InvoicesController = {

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const invoices = await InvoicesService.findAll()
      res.json({ data: invoices, total: invoices.length })
    } catch (err) {
      next(err)
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id      = Number(req.params.id)
      const invoice = await InvoicesService.findById(id)
      if (!invoice) {
        res.status(404).json({ message: 'Factura no encontrada' })
        return
      }
      res.json({ data: invoice })
    } catch (err) {
      next(err)
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = CreateInvoiceSchema.safeParse(req.body)
      if (!parsed.success) {
        res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten() })
        return
      }
      const userId  = (req as any).user.id
      const invoice = await InvoicesService.create(parsed.data, userId)
      res.status(201).json({ data: invoice })
    } catch (err) {
      next(err)
    }
  },

  async changeStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id             = Number(req.params.id)
      const { status }     = req.body
      if (!status) {
        res.status(400).json({ message: 'El campo status es requerido' })
        return
      }

      let voidData
      if (status === 'void') {
        const parsed = VoidInvoiceSchema.safeParse(req.body)
        if (!parsed.success) {
          res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten() })
          return
        }
        voidData = parsed.data
      }

      const invoice = await InvoicesService.changeStatus(id, status, voidData)
      res.json({ data: invoice })
    } catch (err: any) {
      if (err.message === 'INVOICE_NOT_FOUND') {
        res.status(404).json({ message: 'Factura no encontrada' })
        return
      }
      if (err.message?.startsWith('INVALID_TRANSITION')) {
        const [, from, to] = err.message.split(':')
        res.status(409).json({ message: `Transición inválida: de '${from}' a '${to}'` })
        return
      }
      if (err.message === 'VOID_REASON_REQUIRED') {
        res.status(400).json({ message: 'El motivo de anulación es obligatorio' })
        return
      }
      next(err)
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      await InvoicesService.delete(id)
      res.status(204).send()
    } catch (err: any) {
      if (err.message === 'INVOICE_NOT_FOUND') {
        res.status(404).json({ message: 'Factura no encontrada' })
        return
      }
      if (err.message === 'ONLY_DRAFT_DELETABLE') {
        res.status(409).json({ message: 'Solo se pueden eliminar facturas en borrador (TMP)' })
        return
      }
      next(err)
    }
  },
}
