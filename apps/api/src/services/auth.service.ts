// apps/api/src/services/auth.service.ts
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import type { LoginDto, AuthTokens, AuthUser, JwtPayload } from '@finflow/types'

// ── Mock users (se reemplaza con Prisma en Unidad III) ──────────────────────
interface MockUser {
  id: number
  email: string
  passwordHash: string
  name: string
  role: 'admin' | 'user'
}

const mockUsers: MockUser[] = [
  {
    id: 1,
    email: 'admin@finflow.com',
    // Contraseña: Admin1234!
    passwordHash: bcrypt.hashSync('Admin1234!', 10),
    name: 'Admin FinFlow',
    role: 'admin',
  },
  {
    id: 2,
    email: 'user@finflow.com',
    // Contraseña: User1234!
    passwordHash: bcrypt.hashSync('User1234!', 10),
    name: 'Usuario Demo',
    role: 'user',
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '15m'
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d'

function generateAccessToken(user: AuthUser): AuthTokens {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  }
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions)

  // expiresIn en segundos para que el frontend sepa cuándo renovar
  const expiresIn = JWT_EXPIRES_IN === '15m' ? 15 * 60 : 3600

  return { accessToken, expiresIn }
}

function generateRefreshToken(userId: number): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions)
}

// ── Servicio ─────────────────────────────────────────────────────────────────
export const authService = {

  async login(dto: LoginDto): Promise<{ tokens: AuthTokens; user: AuthUser; refreshToken: string }> {
    // 1. Buscar usuario por email
    const found = mockUsers.find(u => u.email === dto.email)
    if (!found) throw new Error('Credenciales inválidas')

    // 2. Verificar contraseña
    const isValid = await bcrypt.compare(dto.password, found.passwordHash)
    if (!isValid) throw new Error('Credenciales inválidas')

    // 3. Construir AuthUser (sin passwordHash)
    const user: AuthUser = {
      id: found.id,
      email: found.email,
      name: found.name,
      role: found.role,
    }

    // 4. Generar tokens
    const tokens = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user.id)

    return { tokens, user, refreshToken }
  },

  verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  },

  refreshAccessToken(refreshToken: string): AuthTokens {
    // 1. Verificar refresh token
    const payload = jwt.verify(refreshToken, JWT_SECRET) as JwtPayload

    // 2. Buscar usuario para reconstruir AuthUser actualizado
    const found = mockUsers.find(u => u.id === payload.sub)
    if (!found) throw new Error('Usuario no encontrado')

    const user: AuthUser = {
      id: found.id,
      email: found.email,
      name: found.name,
      role: found.role,
    }

    // 3. Generar nuevo access token
    return generateAccessToken(user)
  },
}
