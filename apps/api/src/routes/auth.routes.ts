// apps/api/src/routes/auth.routes.ts
import { Router, Request, Response } from 'express'
import { authService } from '../services/auth.service'
import type { LoginDto } from '@finflow/types'

const router: Router = Router()

// Duración de la cookie en ms (7 días)
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica al usuario y devuelve los tokens de acceso.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 *
 * /api/auth/refresh:
 *   post:
 *     summary: Refrescar token
 *     description: Renueva el accessToken usando la cookie httpOnly.
 *     tags: [Autenticación]
 *     responses:
 *       200:
 *         description: Token renovado con éxito
 *       401:
 *         description: Refresh token inválido o expirado
 *
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     description: Elimina la cookie del refresh token.
 *     tags: [Autenticación]
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 */

// POST /auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const dto: LoginDto = req.body
    const { tokens, user, refreshToken } = await authService.login(dto)

    // Refresh token → httpOnly cookie (NO accesible desde JavaScript)
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: REFRESH_TOKEN_MAX_AGE,
      path: '/auth/refresh',   // solo se envía en esta ruta
    })

    res.json({ tokens, user })
  } catch (error) {
    res.status(401).json({ message: (error as Error).message })
  }
})

// POST /auth/refresh
router.post('/refresh', (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refresh_token

  if (!refreshToken) {
    res.status(401).json({ message: 'Refresh token no encontrado' })
    return
  }

  try {
    const tokens = authService.refreshAccessToken(refreshToken)
    res.json({ tokens })
  } catch {
    // Si el refresh token expiró, limpiar la cookie y forzar re-login
    res.clearCookie('refresh_token', { path: '/auth/refresh' })
    res.status(401).json({ message: 'Sesión expirada, inicia sesión nuevamente' })
  }
})

// POST /auth/logout
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('refresh_token', { path: '/auth/refresh' })
  res.json({ message: 'Sesión cerrada correctamente' })
})

export default router
