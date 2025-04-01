import { TeamsController } from '@/controllers/teamsController'
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization'
import { Router } from 'express'

const teamsRoutes = Router()
const teamsController = new TeamsController()

// Criar um time
teamsRoutes.post(
  '/',
  verifyUserAuthorization(['admin']),
  teamsController.create
)

// Listar times
teamsRoutes.get(
  '/',
  verifyUserAuthorization(['admin', 'member']),
  teamsController.index
)

// Editar um time
teamsRoutes.put(
  '/:id',
  verifyUserAuthorization(['admin']),
  teamsController.update
)

// Deletar um time
teamsRoutes.delete(
  '/:id',
  verifyUserAuthorization(['admin']),
  teamsController.remove
)

export { teamsRoutes }
