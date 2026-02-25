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
  // El refresh token llega desde httpOnly cookie, no en el body
  // Este DTO se usa solo para tipar la respuesta del guard
  refreshToken: string
}

export interface JwtPayload {
  sub: number        // userId
  email: string
  role: 'admin' | 'user'
  iat?: number       // issued at (lo agrega jsonwebtoken automáticamente)
  exp?: number       // expiration (lo agrega jsonwebtoken automáticamente)
}