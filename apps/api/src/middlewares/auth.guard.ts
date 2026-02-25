// apps/api/src/middlewares/auth.guard.ts
import type { Request, Response, NextFunction } from 'express'
import { authService } from '../services/auth.service'
import type { AuthUser } from '@finflow/types'

// Extender el tipo Request de Express para agregar req.user
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

export function authGuard(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token no proporcionado' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = authService.verifyAccessToken(token)
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: '',           // el nombre no viaja en el token para mantenerlo liviano
      role: payload.role,
    }
    next()
  } catch {
    res.status(401).json({ message: 'Token inválido o expirado' })
  }
}

// Guard adicional para verificar roles
export function requireRole(...roles: Array<'admin' | 'user'>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'No tienes permisos para esta acción' })
      return
    }
    next()
  }
}
