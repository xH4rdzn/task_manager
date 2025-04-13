import { UsersController } from '@/controllers/usersController'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated'
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization'
import { Router } from 'express'

const usersRoutes = Router()
const usersController = new UsersController()

usersRoutes.post('/', usersController.create)

usersRoutes.use(ensureAuthenticated)
usersRoutes.get('/', verifyUserAuthorization(['admin']), usersController.index)

export { usersRoutes }
