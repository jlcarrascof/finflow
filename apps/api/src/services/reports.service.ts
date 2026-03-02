import { prisma } from '../lib/prisma'

export const ReportsService = {
  async getSummary() {
    const [
      totalInvoices,
      revenue,
      totalExpenses,
      pendingInvoices,
      draftInvoices,
    ] = await prisma.$transaction([
      // 1. Total de facturas oficiales (excluyendo anuladas y borradores)
      prisma.invoice.count({ 
        where: { 
          status: { notIn: ['void', 'draft'] } 
        } 
      }),
      
      // 2. Suma de ingresos (solo facturas pagadas)
      prisma.invoice.aggregate({
        _sum: { total: true },
        where: { status: 'paid' },
      }),
      
      // 3. Suma de gastos (solo gastos aprobados)
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: { status: 'approved' },
      }),
      
      // 4. Facturas emitidas pendientes de pago
      prisma.invoice.count({ where: { status: 'issued' } }),
      
      // 5. Facturas en borrador (conteo independiente)
      prisma.invoice.count({ where: { status: 'draft' } }),
    ])

    // Convertimos los Decimal de Prisma a Number de JS
    return {
      totalInvoices,
      totalRevenue:   Number(revenue._sum.total ?? 0),
      totalExpenses:  Number(totalExpenses._sum.amount ?? 0),
      pendingInvoices,
      draftInvoices,
    }
  }
}