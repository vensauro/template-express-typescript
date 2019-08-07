import { AuthController } from 'app/controllers'
import { Router } from 'express'
import * as asyncHandler from 'express-async-handler'
import * as validate from 'express-validation'

const router = Router()

// login user
router.post(
  '/',
  validate(AuthController.loginValidator),
  asyncHandler(AuthController.login)
)

export default router
