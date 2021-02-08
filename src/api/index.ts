import { Router } from 'express'
import authRoutes from '@/api/routes/auth'
import electionRoutes from '@/api/routes/elections'
import { checkAuth } from './middleware/authentication'

const publicRoutes = Router()
publicRoutes.use('/auth', authRoutes)

const voterRoutes = Router()
// Add voter routes....

const organizerRoutes = Router()
organizerRoutes.use(checkAuth)
organizerRoutes.use('/elections', electionRoutes)

export default Router().use('/public', publicRoutes).use('/voter', voterRoutes).use('/admin', organizerRoutes)
