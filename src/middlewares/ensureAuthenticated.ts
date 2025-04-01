import { authConfig } from '@/config/auth'
import { AppError } from '@/utils/AppError'
import type { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

interface TokenPayload {
  role: string
  sub: string
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const authHeader = request.headers.authorization

    if (!authHeader) {
      throw new AppError('Token Inválido', 401)
    }

    const [, token] = authHeader.split(' ')

    const { role, sub: user_id } = verify(
      token,
      authConfig.jwt.secret
    ) as TokenPayload

    request.user = {
      id: user_id,
      role,
    }

    return next()
  } catch (error) {
    throw new AppError('Token Inválido', 401)
  }
}
