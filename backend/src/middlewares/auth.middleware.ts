import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not configured')
  }
  return secret
}

/**
 * Requires `Authorization: Bearer <jwt>`. Sets `req.userId` and `req.role` on success.
 */
export function verifyToken(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized', message: 'Missing or invalid Authorization header' })
    return
  }

  const token = header.slice('Bearer '.length).trim()
  if (!token) {
    res.status(401).json({ error: 'Unauthorized', message: 'Missing token' })
    return
  }

  try {
    const secret = getJwtSecret()
    const payload = jwt.verify(token, secret) as {
      userId?: string
      role?: string
    }
    if (!payload.userId || (payload.role !== 'buyer' && payload.role !== 'vendor')) {
      res.status(401).json({ error: 'Unauthorized', message: 'Invalid token payload' })
      return
    }
    req.userId = payload.userId
    req.role = payload.role
    next()
  } catch {
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' })
  }
}
