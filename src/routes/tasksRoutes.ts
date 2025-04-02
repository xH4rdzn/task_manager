import { TasksController } from '@/controllers/tasksController'
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization'
import { Router } from 'express'

const tasksRoutes = Router()
const tasksController = new TasksController()

// Criar uma nova tarefa
tasksRoutes.post(
  '/',
  verifyUserAuthorization(['admin']),
  tasksController.create
)

// Listar todas as tarefas
tasksRoutes.get(
  '/',
  verifyUserAuthorization(['admin', 'member']),
  tasksController.index
)

// Mostrar uma tarefa específica
tasksRoutes.get(
  '/:taskId',
  verifyUserAuthorization(['admin', 'member']),
  tasksController.show
)

// Deletar uma tarefa
tasksRoutes.delete(
  '/:taskId',
  verifyUserAuthorization(['admin']),
  tasksController.remove
)

// Atribuir uma tarefa para um usuário
tasksRoutes.patch(
  '/:taskId/user',
  verifyUserAuthorization(['admin']),
  tasksController.update
)

export { tasksRoutes }
