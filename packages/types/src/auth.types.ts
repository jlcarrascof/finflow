export interface LoginDto {
  email: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  expiresIn: number
}

export interface AuthUser {
  id: number
  email: string
  name: string
  role: 'admin' | 'user'
}

// ── NUEVOS ──────────────────────────────────────────────
export interface RefreshTokenDto {
  refreshToken: string
}

// Renombrar para evitar colisión con JwtPayload de @types/jsonwebtoken
export interface FinFlowJwtPayload {
  sub: number
  email: string
  role: 'admin' | 'user'
  iat?: number
  exp?: number
}