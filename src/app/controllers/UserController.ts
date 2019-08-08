import { User } from 'app/database/entity/User'
import { Request, Response } from 'express'
import * as Joi from 'joi'
import { getRepository } from 'typeorm'

class UserController {
  saveValidator = {
    body: {
      username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .max(20)
        .alphanum()
        .required()
    }
  }

  async save(req: Request, res: Response): Promise<Response> {
    const { username, email, password } = req.body
    const user = new User({ username, email, password })

    const userRepository = getRepository(User)

    try {
      const { id, username, email, role } = await userRepository.save(user)
      return res.status(201).json({ id, username, email, role })
    } catch (err) {
      return res.status(409).json({ error: 'User already exists' })
    }
  }

  async remove(req: Request, res: Response): Promise<Response> {
    const { id } = res.locals.jwtPayload.user

    const userRepository = getRepository(User)

    try {
      const userToRemove = await userRepository.findOneOrFail(id)
      const {
        username,
        email,
        role,
        created_at,
        updated_at
      } = await userRepository.remove(userToRemove)
      return res
        .status(200)
        .json({ id, email, role, username, created_at, updated_at })
    } catch (error) {
      return res.status(404).json({ error: 'Resource not found' })
    }
  }
}

export default new UserController()
