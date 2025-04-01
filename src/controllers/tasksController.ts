import { prisma } from '@/database/prisma'
import type { Request, Response } from 'express'
import { z } from 'zod'

class TasksController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      title: z
        .string()
        .min(10, 'O titulo da tarefa deve ter no mínimo 10 caracteres'),
      description: z.string().optional(),
    })

    const { title, description } = bodySchema.parse(request.body)

    const task = await prisma.tasks.create({
      data: {
        title,
        description,
      },
    })
    return response.status(201).json({ task })
  }
}

export { TasksController }
