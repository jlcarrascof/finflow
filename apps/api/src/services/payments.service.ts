import { prisma } from '../lib/prisma'
import type { CreatePaymentDto } from '../dtos/payment.dto'

export const PaymentsService = {
  async findAll() {
    return prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: { invoice: { select: { number: true, total: true } } },
    })
  },

  async findById(id: number) {
    return prisma.payment.findUnique({
      where:   { id },
      include: { invoice: { select: { number: true, total: true } } },
    })
  },

  async findByInvoice(invoiceId: number) {
    return prisma.payment.findMany({
      where:   { invoiceId },
      orderBy: { paidAt: 'desc' },
    })
  },

  async create(data: CreatePaymentDto) {
    return prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({ where: { id: data.invoiceId } })
      if (!invoice)              throw new Error('INVOICE_NOT_FOUND')
      if (invoice.status !== 'issued') throw new Error('INVOICE_NOT_ISSUED')

      const payment = await tx.payment.create({
        data: {
          invoiceId: data.invoiceId,
          amount:    data.amount,
          method:    data.method,
          paidAt:    data.paidAt ? new Date(data.paidAt) : new Date(),
          notes:     data.notes,
        },
      })

      await tx.invoice.update({
        where: { id: data.invoiceId },
        data:  { status: 'paid' },
      })

      return payment
    })
  },
}
