import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import type { Request, Response } from 'express'
import { z } from 'zod'

class TasksController {
  // Criando uma nova tarefa
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      title: z
        .string()
        .min(10, 'O titulo da tarefa deve ter no mínimo 10 caracteres'),
      description: z.string().optional(),
      priority: z.enum(['low', 'medium', 'high']).optional(),
    })

    const { title, description, priority } = bodySchema.parse(request.body)

    const task = await prisma.tasks.create({
      data: {
        title,
        description,
        priority,
      },
    })
    return response.status(201).json({ task })
  }

  // Listar todas as tarefas
  async index(request: Request, response: Response) {
    const tasks = await prisma.tasks.findMany({
      include: {
        team: {
          select: {
            name: true,
          },
        },
        assigned: {
          select: {
            name: true,
          },
        },
      },
    })

    return response.json(tasks)
  }

  // Busca um registro único de tarefa
  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      taskId: z.string().uuid(),
    })

    const { taskId } = paramsSchema.parse(request.params)

    const task = await prisma.tasks.findFirst({
      where: {
        id: taskId,
      },
      include: {
        team: {
          select: {
            name: true,
          },
        },
        assigned: {
          select: {
            name: true,
          },
        },
        tasksLogs: true,
      },
    })

    if (
      request.user?.role === 'member' &&
      request.user.id !== task?.assignedTo
    ) {
      throw new AppError(
        'Membros só podem visualizar suas próprias tarefas',
        401
      )
    }

    return response.json(task)
  }

  // Apagar uma tarefa
  async remove(request: Request, response: Response) {
    const paramsSchema = z.object({
      taskId: z.string().uuid(),
    })

    const { taskId } = paramsSchema.parse(request.params)

    await prisma.tasks.delete({
      where: { id: taskId },
    })

    return response.status(204).json()
  }

  // Atribuindo a tarefa para um usuário
  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      taskId: z.string().uuid(),
    })

    const bodySchema = z.object({
      userId: z.string().uuid(),
    })

    const { taskId } = paramsSchema.parse(request.params)
    const { userId } = bodySchema.parse(request.body)

    const task = await prisma.tasks.findFirst({ where: { id: taskId } })
    const user = await prisma.users.findFirst({ where: { id: userId } })

    if (!task) {
      throw new AppError('Essa tarefa não existe', 404)
    }

    if (!user) {
      throw new AppError('Esse usuário não existe', 404)
    }

    if (task.teamId !== user.teamId) {
      throw new AppError(
        'Essa tarefa não pode ser atribuída a esse usuário, pois ele está em outro time'
      )
    }

    if (task.assignedTo !== null) {
      throw new AppError('Essa Tarefa já está atribuída para outro usuário')
    }

    const assignedTaskToUser = await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        tasks: {
          connect: {
            id: task.id,
          },
        },
      },
    })

    return response.json(assignedTaskToUser)
  }
}

export { TasksController }
