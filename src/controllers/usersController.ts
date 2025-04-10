import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { hash } from 'bcrypt'
import type { Request, Response } from 'express'
import { z } from 'zod'

class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(1, 'O nome deve ter pelo menos 1 caractere'),
      role: z.enum(['admin', 'member']).optional(),
      email: z.string().email(),
      password: z.string().min(6, 'A senha deve ter pelo menos 6 dígitos'),
    })

    const {
      name,
      email,
      password,
      role: userRole,
    } = bodySchema.parse(request.body)

    const hashedPassword = await hash(password, 8)

    const userWithSameEmail = await prisma.users.findFirst({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new AppError('Já existe um usuário com esse e-mail cadastrado')
    }

    const user = await prisma.users.create({
      data: {
        name,
        email,
        role: userRole ?? 'member',
        password: hashedPassword,
      },
    })

    const { password: _, teamId: __, role, ...userWithoutPassword } = user

    return response.status(201).json(userWithoutPassword)
  }

  async index(request: Request, response: Response) {
    const users = await prisma.users.findMany({
      include: {
        team: {
          select: {
            name: true,
          },
        },
      },
    })

    return response.json({ users })
  }
}

export { UsersController }
