import express, { Application, Request, Response, NextFunction } from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import cors from 'cors'
import helmet from 'helmet' // 👈 NUEVO: El casco de seguridad
import rateLimit from 'express-rate-limit' // 👈 NUEVO: El limitador de peticiones
import cookieParser from 'cookie-parser'
import { Prisma } from '@prisma/client'
import reportsRouter from './routes/reports.routes'
import authRouter     from './routes/auth.routes'
import contactsRouter from './routes/contacts.routes'
import itemsRouter    from './routes/items.routes'
import expensesRouter from './routes/expenses.routes'
import paymentsRouter from './routes/payments.routes'
import invoicesRouter from './routes/invoices.routes'

const app: Application = express()
const PORT = process.env.PORT || 3000

// ── 🛡️ SEGURIDAD PRIMERO ──────────────────────────────

// 1. HELMET: Oculta cabeceras sensibles y protege contra vulnerabilidades web comunes
app.use(helmet())

// 2. CORS ESTRICTO: Mezclamos tus puertos de desarrollo con los puertos de los MFEs
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5000', // Shell
    'http://localhost:5001', // Contactos
    'http://localhost:5002', // Gastos
    'http://localhost:5003', // Items
    'http://localhost:5004', // Invoices
    'http://localhost:5005', // Dashboard
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5000',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
}))

// 3. RATE LIMITING: El escudo contra ataques DDoS y Fuerza Bruta
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Ventana de 15 minutos
  max: 100, // Límite de 100 peticiones por IP cada 15 minutos
  message: { 
    error: 'Demasiadas peticiones desde esta IP. Por favor, relájate y vuelve a intentar en 15 minutos.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Aplicamos el candado a todas las rutas que comiencen con /api
app.use('/api', apiLimiter)


// ── Middlewares globales ───────────────────────────────
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ── Configuración de Swagger (INTACTO) ─────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FinFlow API',
      version: '1.0.0',
      description: 'Documentación oficial de la API REST de FinFlow',
    },
    servers: [
      { url: `http://localhost:${PORT}` }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// ── Rutas ─────────────────────────────────────────────
app.use('/api/auth',     authRouter)
app.use('/api/contacts', contactsRouter)
app.use('/api/items',    itemsRouter)
app.use('/api/expenses', expensesRouter)
app.use('/api/payments', paymentsRouter)
app.use('/api/invoices', invoicesRouter)
app.use('/api/reports',  reportsRouter)

// ── Health check ──────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'finflow-api', timestamp: new Date().toISOString() })
})

// ── 404 — Ruta no encontrada ──────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Ruta no encontrada' })
})

// ── Error handler global (INTACTO) ────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Recurso no encontrado' })
    }
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Ya existe un registro con ese valor único' })
    }
  }
  console.error('❌ Error no controlado:', err)
  res.status(500).json({ message: 'Error interno del servidor' })
})

// ── Arranque ──────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 FinFlow API corriendo en http://localhost:${PORT}`)
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`)
})

export default app