import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import type { Request, Response } from 'express'
import z from 'zod'

class TeamsController {
  // Criando o time
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().min(1, 'O nome do time deve ter pelo menos 1 caractere'),
      description: z.string().optional(),
    })

    const { name, description } = bodySchema.parse(request.body)

    const team = await prisma.teams.create({
      data: {
        name,
        description,
      },
    })

    return response.status(201).json({ team })
  }

  // Listar os times
  async index(request: Request, response: Response) {
    const team = await prisma.teams.findMany()
    return response.json(team)
  }

  // Editar um Time
  async update(request: Request, response: Response) {
    const { id } = request.params

    const bodySchema = z.object({
      name: z.string().min(1, 'O nome do time deve ter pelo menos 1 caractere'),
      description: z.string().optional(),
    })

    const { name, description } = bodySchema.parse(request.body)

    const team = await prisma.teams.findFirst({ where: { id } })

    if (!team) {
      throw new AppError('Esse time não existe', 404)
    }

    await prisma.teams.update({
      data: {
        name,
        description,
      },
      where: {
        id,
      },
    })

    return response.json()
  }

  async remove(request: Request, response: Response) {
    const { id } = request.params

    await prisma.teams.delete({
      where: {
        id,
      },
    })

    return response.status(204).json()
  }
}

export { TeamsController }
