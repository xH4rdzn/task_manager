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
