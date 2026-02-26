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
    prisma.contact.create({ data: { name: 'Servicios Globales', email: 'contacto@sglobales.com', phone: '0424-3332211', address: 'Barquisimeto, Venezuela' } }),
    prisma.contact.create({ data: { name: 'Inversiones del Norte', email: 'norte@inversiones.com', phone: '0426-1112233', address: 'Puerto Ordaz, Venezuela', taxId: 'J-11122330-5' } }),
  ])

  console.log('✅ Contactos creados:', contacts.length)

  // ── Items / Productos ─────────────────────────────────
  const items = await Promise.all([
    prisma.item.create({ data: { name: 'Consultoría técnica', description: 'Hora de consultoría en desarrollo de software', price: 50.00, stock: 999, category: 'Servicios' } }),
    prisma.item.create({ data: { name: 'Desarrollo web', description: 'Desarrollo de aplicación web a medida', price: 1200.00, stock: 999, category: 'Servicios' } }),
    prisma.item.create({ data: { name: 'Licencia software anual', description: 'Licencia de uso anual del sistema', price: 350.00, stock: 50, category: 'Licencias' } }),
    prisma.item.create({ data: { name: 'Soporte técnico mensual', description: 'Plan de soporte y mantenimiento mensual', price: 150.00, stock: 999, category: 'Soporte' } }),
    prisma.item.create({ data: { name: 'Capacitación (4h)', description: 'Sesión de capacitación presencial o remota', price: 200.00, stock: 999, category: 'Capacitación' } }),
    prisma.item.create({ data: { name: 'Servidor VPS mensual', description: 'Servidor virtual privado — plan básico', price: 25.00, stock: 100, category: 'Infraestructura' } }),
    prisma.item.create({ data: { name: 'Dominio .com anual', description: 'Registro y renovación de dominio', price: 15.00, stock: 999, category: 'Infraestructura' } }),
    prisma.item.create({ data: { name: 'Diseño UI/UX', description: 'Diseño de interfaces y experiencia de usuario', price: 800.00, stock: 999, category: 'Diseño' } }),
  ])

  console.log('✅ Items creados:', items.length)

  // ── Facturas con líneas ───────────────────────────────
  const invoice1 = await prisma.invoice.create({
    data: {
      number: 'FAC-000001',
      status: InvoiceStatus.paid,
      dueDate: new Date('2026-03-01'),
      userId: admin.id,
      contactId: contacts[0].id,
      subtotal: 1400.00,
      tax: 224.00,
      total: 1624.00,
      notes: 'Pago anticipado aplicado',
      lines: {
        create: [
          { quantity: 1, unitPrice: 1200.00, subtotal: 1200.00, itemId: items[1].id, description: 'Desarrollo web corporativo' },
          { quantity: 4, unitPrice: 50.00,   subtotal: 200.00,  itemId: items[0].id, description: 'Consultoría inicial' },
        ],
      },
      payments: {
        create: [
          { amount: 1624.00, method: 'transferencia', notes: 'Pago total recibido' },
        ],
      },
    },
  })

  const invoice2 = await prisma.invoice.create({
    data: {
      number: 'FAC-000002',
      status: InvoiceStatus.sent,
      dueDate: new Date('2026-03-15'),
      userId: admin.id,
      contactId: contacts[1].id,
      subtotal: 500.00,
      tax: 80.00,
      total: 580.00,
      lines: {
        create: [
          { quantity: 2, unitPrice: 150.00, subtotal: 300.00, itemId: items[3].id, description: 'Soporte técnico — Feb + Mar' },
          { quantity: 1, unitPrice: 200.00, subtotal: 200.00, itemId: items[4].id, description: 'Capacitación equipo' },
        ],
      },
    },
  })

  const invoice3 = await prisma.invoice.create({
    data: {
      number: 'FAC-000003',
      status: InvoiceStatus.draft,
      dueDate: new Date('2026-04-01'),
      userId: user.id,
      contactId: contacts[2].id,
      subtotal: 390.00,
      tax: 62.40,
      total: 452.40,
      lines: {
        create: [
          { quantity: 1, unitPrice: 350.00, subtotal: 350.00, itemId: items[2].id, description: 'Licencia anual 2026' },
          { quantity: 1, unitPrice: 15.00,  subtotal: 15.00,  itemId: items[6].id, description: 'Dominio .com' },
          { quantity: 1, unitPrice: 25.00,  subtotal: 25.00,  itemId: items[5].id, description: 'VPS enero' },
        ],
      },
    },
  })

  console.log('✅ Facturas creadas:', invoice1.number, invoice2.number, invoice3.number)

  // ── Gastos ────────────────────────────────────────────
  await prisma.expense.create({
    data: {
      description: 'Suscripción GitHub Teams',
      amount: 48.00,
      category: 'Software',
      status: ExpenseStatus.approved,
      userId: admin.id,
    },
  })

  await prisma.expense.create({
    data: {
      description: 'Publicidad Google Ads — Febrero',
      amount: 120.00,
      category: 'Marketing',
      status: ExpenseStatus.pending,
      userId: admin.id,
    },
  })

  console.log('✅ Gastos creados: 2')
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
