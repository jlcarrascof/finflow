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
