import type { Request, Response, NextFunction } from 'express'
import { PaymentsService } from '../services/payments.service'
import { CreatePaymentSchema } from '../dtos/payment.dto'

export const PaymentsController = {

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const payments = await PaymentsService.findAll()
      res.json({ data: payments, total: payments.length })
    } catch (err) {
      next(err)
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id      = Number(req.params.id)
      const payment = await PaymentsService.findById(id)
      if (!payment) {
        res.status(404).json({ message: 'Pago no encontrado' })
        return
      }
      res.json({ data: payment })
    } catch (err) {
      next(err)
    }
  },

  async getByInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const invoiceId = Number(req.params.invoiceId)
      const payments  = await PaymentsService.findByInvoice(invoiceId)
      res.json({ data: payments, total: payments.length })
    } catch (err) {
      next(err)
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = CreatePaymentSchema.safeParse(req.body)
      if (!parsed.success) {
        res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten() })
        return
      }
      const payment = await PaymentsService.create(parsed.data)
      res.status(201).json({ data: payment })
    } catch (err: any) {
      if (err.message === 'INVOICE_NOT_FOUND') {
        res.status(404).json({ message: 'Factura no encontrada' })
        return
      }
      if (err.message === 'INVOICE_NOT_ISSUED') {
        res.status(409).json({ message: 'Solo se pueden registrar pagos en facturas emitidas' })
        return
      }
      next(err)
    }
  },
}
