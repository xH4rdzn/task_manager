import { TeamModifierController } from '@/controllers/teamModifierController'
import { TeamsController } from '@/controllers/teamsController'
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization'
import { Router } from 'express'

const teamsRoutes = Router()
const teamsController = new TeamsController()
const teamModifierController = new TeamModifierController()

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

// Adicionar um usuário a um time
teamsRoutes.patch(
  '/:teamId/members',
  verifyUserAuthorization(['admin']),
  teamModifierController.update
)

// Atribuir uma tarefa para um time
teamsRoutes.patch(
  '/:teamId/tasks',
  verifyUserAuthorization(['admin']),
  teamModifierController.assignTasks
)

export { teamsRoutes }
