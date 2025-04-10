import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import type { Request, Response } from 'express'
import { z } from 'zod'

class TaskLogsController {
  // Criar um log e atualizar o status da tarefa
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      taskId: z.string().uuid(),
      newStatus: z.enum(['pending', 'in_progress', 'completed']),
    })

    const { taskId, newStatus } = bodySchema.parse(request.body)

    const task = await prisma.tasks.findUnique({
      where: {
        id: taskId,
      },
    })

    if (!task) {
      throw new AppError('Tarefa não encontrada', 404)
    }

    if (task.status === 'completed') {
      throw new AppError('Essa tarefa já está completa')
    }

    if (task.assignedTo !== request.user?.id) {
      throw new AppError(
        'Essa tarefa não pertence a seu usuário, entre em contato com um administrador',
        401
      )
    }

    if (task.status === 'in_progress' && newStatus === 'pending') {
      throw new AppError('Essa tarefa não pode voltar para o status pendente')
    }

    if (task.status === newStatus) {
      throw new AppError('Essa tarefa já está nesse status')
    }

    const taskLog = await prisma.tasksLogs.create({
      data: {
        newStatus,
        oldStatus: task.status,
        changedBy: request.user?.id,
        taskId,
      },
    })

    await prisma.tasks.update({
      where: {
        id: taskId,
      },
      data: {
        status: newStatus,
      },
    })

    return response.json({ taskLog })
  }

  async index(request: Request, response: Response) {
    const taskLogs = await prisma.tasksLogs.findMany({
      orderBy: {
        changedAt: 'desc',
      },
    })

    return response.json({ taskLogs })
  }
}

export { TaskLogsController }
