import { AdminController } from 'app/controllers'
import { Router } from 'express'
import { checkJwt, checkRole } from 'app/middlewares'
import * as asyncHandler from 'express-async-handler'
import * as validate from 'express-validation'
import { UserRole } from 'app/database/entity/User'

const router = Router()

// create new user with role param acessible
router.post(
  '/',
  checkJwt,
  checkRole([UserRole.ADMIN]),
  validate(AdminController.saveValidator),
  asyncHandler(AdminController.save)
)

// delete user with id
router.delete(
  '/',
  checkJwt,
  checkRole([UserRole.ADMIN]),
  validate(AdminController.removeValidator),
  asyncHandler(AdminController.remove)
)

// get one user with id or username
router.get(
  '/:id',
  checkJwt,
  checkRole([UserRole.ADMIN]),
  validate(AdminController.oneValidator),
  asyncHandler(AdminController.one)
)

// get all users
router.get(
  '/',
  checkJwt,
  checkRole([UserRole.ADMIN]),
  asyncHandler(AdminController.all)
)

export default router
