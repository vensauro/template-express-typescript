import { UserController } from 'controllers'
import { checkJwt } from 'middlewares'
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

// update username and other resources about the user
router.put(
  '/',
  checkJwt,
  validate(UserController.updateValidator),
  asyncHandler(UserController.update)
)

export default router
