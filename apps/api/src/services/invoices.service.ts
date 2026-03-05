import { prisma } from '../lib/prisma'
import type { CreateInvoiceDto, VoidInvoiceDto } from '../dtos/invoice.dto'

const VALID_TRANSITIONS: Record<string, string[]> = {
  draft:  ['issued', 'void'],
  issued: ['paid', 'void'],
  paid:   [],
  void:   [],
}

export const InvoicesService = {
  async findAll() {
    return prisma.invoice.findMany({
      orderBy: { createdAt: 'desc' },
      include: { contact: { select: { id: true, name: true } } },
    })
  },

  async findById(id: number) {
    return prisma.invoice.findUnique({
      where:   { id },
      include: {
        contact:  { select: { id: true, name: true } },
        lines:    { include: { item: { select: { id: true, name: true } } } },
        payments: true,
      },
    })
  },

  async create(data: CreateInvoiceDto, userId: number) {
    return prisma.$transaction(async (tx) => {
      // Número TMP correlativo basado en el total de facturas existentes
      const totalCount = await tx.invoice.count()
      const number     = `TMP-${String(totalCount + 1).padStart(7, '0')}`

      const subtotal = data.lines.reduce(
        (acc, l) => acc + l.quantity * l.unitPrice, 0
      )
      const tax   = subtotal * 0.16
      const total = subtotal + tax

      return tx.invoice.create({
        data: {
          number,
          status:    'draft',
          userId,
          contactId: data.contactId,
          dueDate:   data.dueDate ? new Date(data.dueDate) : null,
          notes:     data.notes,
          subtotal,
          tax,
          total,
          lines: {
            create: data.lines.map(l => ({
              itemId:    l.itemId,
              quantity:  l.quantity,
              unitPrice: l.unitPrice,
              subtotal:  l.quantity * l.unitPrice,
            })),
          },
        },
        include: {
          contact: { select: { id: true, name: true } },
          lines:   true,
        },
      })
    })
  },

  async changeStatus(id: number, newStatus: string, voidData?: VoidInvoiceDto) {
    return prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({ where: { id } })
      if (!invoice) throw new Error('INVOICE_NOT_FOUND')

      const allowed = VALID_TRANSITIONS[invoice.status] ?? []
      if (!allowed.includes(newStatus)) {
        throw new Error(`INVALID_TRANSITION:${invoice.status}:${newStatus}`)
      }

      // 1. Lógica para emitir
      if (newStatus === 'issued') {
        const issuedCount = await tx.invoice.count({
          where: { status: { in: ['issued', 'paid', 'void'] } },
        })
        const facNumber = `FAC-${String(issuedCount + 1).padStart(7, '0')}`

        return tx.invoice.update({
          where: { id },
          data:  { number: facNumber, status: 'issued', issueDate: new Date() },
          include: {
            contact: { select: { id: true, name: true } },
            lines:   { include: { item: { select: { id: true, name: true } } } },
          },
        })
      }

      // 2. Lógica para anular
      if (newStatus === 'void') {
        if (!voidData?.voidReason) throw new Error('VOID_REASON_REQUIRED')
        return tx.invoice.update({
          where: { id },
          data:  { status: 'void', voidReason: voidData.voidReason, voidedAt: new Date() },
          include: {
            contact: { select: { id: true, name: true } },
            lines:   { include: { item: { select: { id: true, name: true } } } },
          },
        })
      }

      // 3. NUEVO CANDADO: Lógica estricta para pagos
      if (newStatus === 'paid') {
        if (!invoice.issueDate) {
          throw new Error('CANNOT_PAY_UNISSUED_INVOICE')
        }
      }

      // 4. Actualización general
      return tx.invoice.update({
        where:   { id },
        data:    { status: newStatus as any },
        include: {
          contact: { select: { id: true, name: true } },
          lines:   { include: { item: { select: { id: true, name: true } } } },
        },
      })
    })
  },

  async delete(id: number) {
    return prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({ where: { id } })
      if (!invoice)                    throw new Error('INVOICE_NOT_FOUND')
      if (invoice.status !== 'draft')  throw new Error('ONLY_DRAFT_DELETABLE')
      return tx.invoice.delete({ where: { id } })
    })
  },
}
