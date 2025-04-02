import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import type { Request, Response } from 'express'
import z from 'zod'

class TeamModifierController {
  // Adicionando um usuário a um time
  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      teamId: z.string().uuid(),
    })

    const bodySchema = z.object({
      userId: z.string().uuid(),
    })

    const { teamId } = paramsSchema.parse(request.params)
    const { userId } = bodySchema.parse(request.body)

    const team = await prisma.teams.findFirst({ where: { id: teamId } })
    const user = await prisma.users.findFirst({ where: { id: userId } })

    if (!team) {
      throw new AppError('Esse time não existe')
    }

    if (!user) {
      throw new AppError('Esse usuário não existe')
    }

    if (user.teamId === teamId) {
      throw new AppError('Esse usuário já pertence a esse time')
    }

    const updatedTeam = await prisma.teams.update({
      data: {
        users: {
          connect: {
            id: user.id,
          },
        },
      },
      where: {
        id: team.id,
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return response.json({ updatedTeam })
  }

  // Atribuindo tarefas a um time
  async assignTasks(request: Request, response: Response) {
    const paramsSchema = z.object({
      teamId: z.string().uuid(),
    })

    const bodySchema = z.object({
      taskId: z.string().uuid(),
    })

    const { teamId } = paramsSchema.parse(request.params)
    const { taskId } = bodySchema.parse(request.body)

    const team = await prisma.teams.findFirst({ where: { id: teamId } })
    const task = await prisma.tasks.findFirst({ where: { id: taskId } })

    if (!team) {
      throw new AppError('Esse time não existe')
    }

    if (!task) {
      throw new AppError('Essa tarefa não existe')
    }

    const assignTask = await prisma.teams.update({
      data: {
        tasks: {
          connect: {
            id: task.id,
          },
        },
      },
      where: {
        id: team.id,
      },
    })

    return response.json(assignTask)
  }
}

export { TeamModifierController }
