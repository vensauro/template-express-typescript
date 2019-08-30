import { Request, Response } from 'express'
import * as Joi from 'joi'
import { User } from 'models/database/entity'

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

    try {
      const { id, username, email, role } = await User.repository().save(user)
      return res.status(201).json({ id, username, email, role })
    } catch (err) {
      return res.status(409).json({ error: 'User already exists' })
    }
  }

  async remove(req: Request, res: Response): Promise<Response> {
    const { id } = res.locals.jwtPayload.user

    const userToRemove = await User.repository().findOneOrFail(id)
    const {
      username,
      email,
      role,
      created_at,
      updated_at
    } = await User.repository().remove(userToRemove)
    return res
      .status(200)
      .json({ id, email, role, username, created_at, updated_at })
  }

  updateValidator = {
    body: {
      username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = res.locals.jwtPayload.user
    const { username } = req.body

    const user = await User.repository().findOneOrFail(id)
    user.username = username

    User.repository().save(user)

    return res.status(201).json(user)
  }
}

export default new UserController()
