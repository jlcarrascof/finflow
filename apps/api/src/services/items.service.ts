import { prisma } from '../lib/prisma'
import type { CreateItemDto, UpdateItemDto } from '../dtos/item.dto'

export const ItemsService = {
  async findAll() {
    return prisma.item.findMany({ orderBy: { createdAt: 'desc' } })
  },

  async findById(id: number) {
    return prisma.item.findUnique({ where: { id } })
  },

  async create(data: CreateItemDto) {
    return prisma.item.create({ data })
  },

  async update(id: number, data: UpdateItemDto) {
    return prisma.item.update({ where: { id }, data })
  },

  async delete(id: number) {
    return prisma.item.delete({ where: { id } })
  },
}
