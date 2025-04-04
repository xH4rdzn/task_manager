import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import type { Request, Response } from 'express'
import { z } from 'zod'

class TaskLogsController {
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

    return response.json({ message: 'ok' })
  }
}

export { TaskLogsController }
