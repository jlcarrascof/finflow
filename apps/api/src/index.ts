import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { Prisma } from '@prisma/client'
import contactsRouter from './routes/contacts.routes'
import authRouter from './routes/auth.routes'

const app: Application = express()
const PORT = process.env.PORT || 3000

// ── CORS ──────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5000',
  ],
  credentials: true,
}))

// ── Middlewares globales ───────────────────────────────
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ── Rutas ─────────────────────────────────────────────
app.use('/api/auth',     authRouter)
app.use('/api/contacts', contactsRouter)

// ── Health check ──────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'finflow-api', timestamp: new Date().toISOString() })
})

// ── 404 — Ruta no encontrada ──────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Ruta no encontrada' })
})

// ── Error handler global ──────────────────────────────
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
