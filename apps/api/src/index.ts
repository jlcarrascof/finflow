import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'           // ← NUEVO
import contactsRouter from './routes/contacts.routes'
import authRouter from './routes/auth.routes'       // ← NUEVO

const app: Application = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5000',
  ],
  credentials: true,           // ← necesario para que las cookies funcionen con CORS
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())        // ← NUEVO: parsea req.cookies

app.use('/auth', authRouter)           // ← NUEVO
app.use('/contacts', contactsRouter)

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'finflow-api', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`🚀 Finflow API corriendo en http://localhost:${PORT}`)
  console.log(`📋 Health check: http://localhost:${PORT}/health`)
})

export default app
