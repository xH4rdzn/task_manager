import { TaskLogsController } from '@/controllers/taskLogsController'
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization'
import { Router } from 'express'

const taskLogsRoutes = Router()
const taskLogsController = new TaskLogsController()

taskLogsRoutes.post(
  '/',
  verifyUserAuthorization(['member']),
  taskLogsController.create
)

taskLogsRoutes.get(
  '/',
  verifyUserAuthorization(['admin']),
  taskLogsController.index
)

export { taskLogsRoutes }
