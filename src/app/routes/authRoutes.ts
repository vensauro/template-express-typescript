import { LoginController, PasswordController } from 'controllers'
import { Router } from 'express'
import * as asyncHandler from 'express-async-handler'
import * as validate from 'express-validation'

const router = Router()

// login user
router.post(
  '/login',
  validate(LoginController.loginValidator),
  asyncHandler(LoginController.login)
)

router.post(
  '/forgot-password',
  validate(PasswordController.forgotValidator),
  asyncHandler(PasswordController.forgot)
)

router.put(
  '/reset-password',
  validate(PasswordController.updateValidator),
  asyncHandler(PasswordController.update)
)

export default router
