import { PrismaClient, Role, InvoiceStatus, ExpenseStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // ── Limpiar DB en orden por dependencias ──────────────
  await prisma.payment.deleteMany()
  await prisma.invoiceLine.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.expense.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.item.deleteMany()
  await prisma.user.deleteMany()

  // ── Usuarios ──────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 10)
  const userPassword  = await bcrypt.hash('user123', 10)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@finflow.dev',
      password: adminPassword,
      name: 'Admin FinFlow',
      role: Role.admin,
    },
  })

  const user = await prisma.user.create({
    data: {
      email: 'user@finflow.dev',
      password: userPassword,
      name: 'Usuario Demo',
      role: Role.user,
    },
  })

  console.log('✅ Usuarios creados:', admin.email, user.email)

  // ── Contactos ─────────────────────────────────────────
  const contacts = await Promise.all([
    prisma.contact.create({ data: { name: 'Empresa ABC', email: 'abc@empresa.com', phone: '0412-1234567', address: 'Caracas, Venezuela', taxId: 'J-12345678-9' } }),
    prisma.contact.create({ data: { name: 'Distribuidora XYZ', email: 'xyz@distribuidora.com', phone: '0414-9876543', address: 'Maracaibo, Venezuela', taxId: 'J-98765432-1' } }),
    prisma.contact.create({ data: { name: 'Tech Solutions', email: 'info@techsolutions.com', phone: '0416-5554433', address: 'Valencia, Venezuela', taxId: 'J-55544332-0' } }),
  ])

  // ── Items / Productos ─────────────────────────────────
  const items = await Promise.all([
    prisma.item.create({ data: { name: 'Consultoría técnica', description: 'Hora de consultoría en desarrollo de software', price: 50.00, stock: 999, category: 'Servicios' } }),
    prisma.item.create({ data: { name: 'Desarrollo web', description: 'Desarrollo de aplicación web a medida', price: 1200.00, stock: 999, category: 'Servicios' } }),
    prisma.item.create({ data: { name: 'Licencia software anual', description: 'Licencia de uso anual del sistema', price: 350.00, stock: 50, category: 'Licencias' } }),
  ])

  // ── Facturas Oficiales (FAC-000000X) ───────────────────────────────
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // 1. Emitida (Normal)
  await prisma.invoice.create({
    data: {
      number: 'FAC-0000001',
      status: InvoiceStatus.issued,
      issueDate: yesterday, // ¡Fecha obligatoria!
      dueDate: new Date('2026-04-01'),
      userId: admin.id,
      contactId: contacts[0].id,
      subtotal: 100.00, tax: 16.00, total: 116.00,
      lines: { create: [{ quantity: 2, unitPrice: 50.00, subtotal: 100.00, itemId: items[0].id }] },
    },
  })

  // 2. Anulada (Void) - Mantiene el correlativo pero no suma
  await prisma.invoice.create({
    data: {
      number: 'FAC-0000002',
      status: InvoiceStatus.void,
      issueDate: yesterday,
      voidReason: 'Error en los datos fiscales del cliente',
      voidedAt: today,
      userId: admin.id,
      contactId: contacts[1].id,
      subtotal: 1200.00, tax: 192.00, total: 1392.00,
      lines: { create: [{ quantity: 1, unitPrice: 1200.00, subtotal: 1200.00, itemId: items[1].id }] },
    },
  })

  // 3. Emitida (Normal)
  await prisma.invoice.create({
    data: {
      number: 'FAC-0000003',
      status: InvoiceStatus.issued,
      issueDate: today,
      dueDate: new Date('2026-04-15'),
      userId: admin.id,
      contactId: contacts[2].id,
      subtotal: 350.00, tax: 56.00, total: 406.00,
      lines: { create: [{ quantity: 1, unitPrice: 350.00, subtotal: 350.00, itemId: items[2].id }] },
    },
  })

  // 4. Pagada (Paid) - Es la que suma a tus ingresos en el dashboard
  await prisma.invoice.create({
    data: {
      number: 'FAC-0000004',
      status: InvoiceStatus.paid,
      issueDate: yesterday,
      dueDate: new Date('2026-03-30'),
      userId: admin.id,
      contactId: contacts[0].id,
      subtotal: 1400.00, tax: 224.00, total: 1624.00,
      lines: {
        create: [
          { quantity: 1, unitPrice: 1200.00, subtotal: 1200.00, itemId: items[1].id },
          { quantity: 4, unitPrice: 50.00,  subtotal: 200.00,  itemId: items[0].id },
        ],
      },
      payments: {
        create: [{ amount: 1624.00, method: 'transferencia', notes: 'Pago total recibido' }],
      },
    },
  })

  // 5. Emitida (Normal)
  await prisma.invoice.create({
    data: {
      number: 'FAC-0000005',
      status: InvoiceStatus.issued,
      issueDate: today,
      dueDate: new Date('2026-04-20'),
      userId: user.id,
      contactId: contacts[1].id,
      subtotal: 150.00, tax: 24.00, total: 174.00,
      lines: { create: [{ quantity: 3, unitPrice: 50.00, subtotal: 150.00, itemId: items[0].id }] },
    },
  })

  console.log('✅ Facturas oficiales creadas: 5 (1 Anulada, 1 Pagada)')

  // ── Facturas Temporales (Borradores / Drafts) ───────────────────────────────
  
  await prisma.invoice.create({
    data: {
      number: 'TMP-0000001',
      status: InvoiceStatus.draft,
      // No lleva issueDate porque no es oficial
      userId: admin.id,
      contactId: contacts[2].id,
      subtotal: 50.00, tax: 8.00, total: 58.00,
      lines: { create: [{ quantity: 1, unitPrice: 50.00, subtotal: 50.00, itemId: items[0].id }] },
    },
  })

  await prisma.invoice.create({
    data: {
      number: 'TMP-0000002',
      status: InvoiceStatus.draft,
      userId: user.id,
      contactId: contacts[0].id,
      subtotal: 350.00, tax: 56.00, total: 406.00,
      lines: { create: [{ quantity: 1, unitPrice: 350.00, subtotal: 350.00, itemId: items[2].id }] },
    },
  })

  await prisma.invoice.create({
    data: {
      number: 'TMP-0000003',
      status: InvoiceStatus.draft,
      userId: admin.id,
      contactId: contacts[1].id,
      subtotal: 1200.00, tax: 192.00, total: 1392.00,
      lines: { create: [{ quantity: 1, unitPrice: 1200.00, subtotal: 1200.00, itemId: items[1].id }] },
    },
  })

  console.log('✅ Borradores creados: 3')

  // ── Gastos ────────────────────────────────────────────
  await prisma.expense.create({
    data: {
      description: 'Suscripción GitHub Teams', amount: 48.00, category: 'Software',
      status: ExpenseStatus.approved, userId: admin.id,
    },
  })

  console.log('✅ Gastos creados: 1')
  console.log('🎉 Seed completado exitosamente')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })