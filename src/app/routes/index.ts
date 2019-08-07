import { Router } from 'express'

import adminRoutes from './adminRoutes'
import authRoutes from './authRoutes'
import userRoutes from './userRoutes'

const router = Router()

router.use('/admin', adminRoutes)
router.use('/auth', authRoutes)
router.use('/user', userRoutes)

export default router
