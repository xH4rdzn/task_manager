import { TasksController } from '@/controllers/tasksController'
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization'
import { Router } from 'express'

const tasksRoutes = Router()
const tasksController = new TasksController()

tasksRoutes.post(
  '/',
  verifyUserAuthorization(['admin']),
  tasksController.create
)

export { tasksRoutes }
