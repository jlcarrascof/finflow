import { prisma } from '../lib/prisma'
import type { CreateExpenseDto, UpdateExpenseDto, VoidExpenseDto } from '../dtos/expense.dto'

export const ExpensesService = {
  async findAll() {
    return prisma.expense.findMany({ orderBy: { createdAt: 'desc' } })
  },

  async findById(id: number) {
    return prisma.expense.findUnique({ where: { id } })
  },

  async create(data: CreateExpenseDto, userId: number) {
    return prisma.expense.create({
      data: {
        ...data,
        date:   data.date ? new Date(data.date) : new Date(),
        userId,
      },
    })
  },

  async update(id: number, data: UpdateExpenseDto) {
    return prisma.expense.update({
      where: { id },
      data:  {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
    })
  },

  async void(id: number, data: VoidExpenseDto) {
    return prisma.expense.update({
      where: { id },
      data:  { status: 'void', voidReason: data.voidReason },
    })
  },

  async delete(id: number) {
    return prisma.expense.delete({ where: { id } })
  },
}
