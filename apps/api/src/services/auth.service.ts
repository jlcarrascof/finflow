// apps/api/src/services/auth.service.ts
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'
import type { LoginDto, AuthTokens, AuthUser, FinFlowJwtPayload } from '@finflow/types'

const JWT_SECRET            = process.env.JWT_SECRET!
const JWT_EXPIRES_IN        = process.env.JWT_EXPIRES_IN        ?? '15m'
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d'

// ── Helpers ───────────────────────────────────────────────────────────────────
function generateAccessToken(user: AuthUser): AuthTokens {
  const payload: FinFlowJwtPayload = {
    sub:   user.id,
    email: user.email,
    role:  user.role,
  }
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions)

  const expiresIn = JWT_EXPIRES_IN === '15m' ? 15 * 60 : 3600

  return { accessToken, expiresIn }
}

function generateRefreshToken(userId: number): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions)
}

// ── Servicio ──────────────────────────────────────────────────────────────────
export const authService = {

  async login(dto: LoginDto): Promise<{ tokens: AuthTokens; user: AuthUser; refreshToken: string }> {
    // 1. Buscar usuario en PostgreSQL
    const found = await prisma.user.findUnique({
      where: { email: dto.email },
    })
    if (!found) throw new Error('Credenciales inválidas')

    // 2. Verificar contraseña con bcrypt
    const isValid = await bcrypt.compare(dto.password, found.password)
    if (!isValid) throw new Error('Credenciales inválidas')

    // 3. Construir AuthUser (sin password)
    const user: AuthUser = {
      id:    found.id,
      email: found.email,
      name:  found.name,
      role:  found.role,
    }

    // 4. Generar tokens
    const tokens       = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user.id)

    return { tokens, user, refreshToken }
  },

  verifyAccessToken(token: string): FinFlowJwtPayload {
    return jwt.verify(token, JWT_SECRET) as unknown as FinFlowJwtPayload
  },

  async refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
    // 1. Verificar refresh token
    const payload = jwt.verify(refreshToken, JWT_SECRET) as unknown as FinFlowJwtPayload

    // 2. Buscar usuario actualizado en PostgreSQL
    const found = await prisma.user.findUnique({
      where: { id: payload.sub },
    })
    if (!found) throw new Error('Usuario no encontrado')

    const user: AuthUser = {
      id:    found.id,
      email: found.email,
      name:  found.name,
      role:  found.role,
    }

    // 3. Generar nuevo access token
    return generateAccessToken(user)
  },
}

