import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated'
import { Router } from 'express'
import { sessionsRoutes } from './sessionsRoutes'
import { tasksRoutes } from './tasksRoutes'
import { teamsRoutes } from './teamsRoutes'
import { usersRoutes } from './usersRoutes'

const routes = Router()
// Rotas Públicas
routes.use('/users', usersRoutes)
routes.use('/sessions', sessionsRoutes)

// Rotas Privadas
routes.use(ensureAuthenticated)
routes.use('/teams', teamsRoutes)
routes.use('/tasks', tasksRoutes)

export { routes }
