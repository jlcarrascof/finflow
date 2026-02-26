import { PrismaClient } from '@prisma/client'
import type { CreateContactDto, UpdateContactDto } from '../dtos/contact.dto'

import { prisma } from '../lib/prisma'  // ← importar el singleton

export const ContactsService = {
  async findAll() {
    return prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    })
  },

  async findById(id: number) {
    return prisma.contact.findUnique({
      where: { id },
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
