import type { CreateContactDto, UpdateContactDto } from '../dtos/contact.dto'
import { prisma } from '../lib/prisma'

export const ContactsService = {
  async findAll() {
    return prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    })
  },

  async findById(id: number) {
    return prisma.contact.findUnique({
      where: { id },
      include: {
        invoices: {
          select: { id: true, number: true, status: true, total: true }
        }
      }
    })
  },

  async create(data: CreateContactDto) {
    return prisma.contact.create({ data })
  },

  async update(id: number, data: UpdateContactDto) {
    return prisma.contact.update({
      where: { id },
      data,
    })
  },

  async delete(id: number) {
    return prisma.contact.delete({
      where: { id },
    })
  },
}
