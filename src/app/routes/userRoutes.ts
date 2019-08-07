import { UserController } from 'app/controllers'
import { checkJwt } from 'app/middlewares'
import { Router } from 'express'
import * as asyncHandler from 'express-async-handler'
import * as validate from 'express-validation'

const router = Router()

// create new user
router.post(
  '/',
  validate(UserController.saveValidator),
  asyncHandler(UserController.save)
)
// delete loged user
router.delete('/', checkJwt, asyncHandler(UserController.remove))

export default router
