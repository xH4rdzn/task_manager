import { authConfig } from '@/config/auth'
import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { compare } from 'bcrypt'
import type { Request, Response } from 'express'
import { sign } from 'jsonwebtoken'
import { z } from 'zod'

class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6, 'A senha possui pelo menos 6 dígitos'),
    })

    const { email, password } = bodySchema.parse(request.body)

    const user = await prisma.users.findFirst({
      where: { email },
    })

    if (!user) {
      throw new AppError('E-mail ou senha inválidos', 401)
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new AppError('E-mail ou senha inválidos', 401)
    }

    const { secret, expiresIn } = authConfig.jwt

    const token = sign({ role: user.role }, secret, {
      subject: user.id,
      expiresIn,
    })

    const { password: _, teamId: __, ...userWithoutPassword } = user

    return response.json({ token, user: userWithoutPassword })
  }
}

export { SessionsController }
