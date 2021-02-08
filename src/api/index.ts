import { Router } from 'express'
import authRoutes from '@/api/auth'
import electionRoutes from '@/api/election'

const publicRoutes = Router()
publicRoutes.use('/auth', authRoutes)

const voterRoutes = Router()
// Add voter routes....

const organizerRoutes = Router()
organizerRoutes.use((request, response, next) => {
  // TODO: Validate JWT token
  next()
})
organizerRoutes.use('/elections', electionRoutes)

export default Router().use('/public', publicRoutes).use('/voter', voterRoutes).use('/admin', organizerRoutes)
