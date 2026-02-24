import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import contactsRouter from './routes/contacts.routes'

const app: Application = express()
const PORT = process.env.PORT || 3000

// CORS — permite peticiones desde el frontend en desarrollo
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5000',  
  ],
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rutas
app.use('/contacts', contactsRouter)

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'finflow-api',
    timestamp: new Date().toISOString(),
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Finflow API corriendo en http://localhost:${PORT}`)
  console.log(`📋 Health check: http://localhost:${PORT}/health`)
})

export default app
