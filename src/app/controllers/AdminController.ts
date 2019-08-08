import { User, UserRole } from 'app/database/entity/User'
import { Request, Response } from 'express'
import * as Joi from 'joi'
import { getRepository, Like } from 'typeorm'

class AdminController {
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
        .required(),
      role: Joi.string().valid(Object.values(UserRole))
    }
  }

  async save(req: Request, res: Response): Promise<Response> {
    const { username, email, password, role } = req.body
    const user = new User({ username, email, password })
    if (role) user.role = role

    const userRepository = getRepository(User)

    try {
      const { id, username, email, role } = await userRepository.save(user)
      return res.status(201).json({ id, username, email, role })
    } catch (err) {
      return res.status(409).json({ error: 'User already exists' })
    }
  }

  async all(req: Request, res: Response): Promise<void> {
    const users = await getRepository(User).find()

    res.status(200).json(users)
  }

  oneValidator = {
    params: {
      id: [Joi.string().required(), Joi.number().required()]
    }
  }

  async one(req: Request, res: Response): Promise<Response> {
    const query = req.params.id

    const userRepository = getRepository(User)

    const type = typeof query

    switch (type) {
      case 'number':
        try {
          const user = await userRepository.findOneOrFail(query)
          return res.status(200).json(user)
        } catch (error) {
          return res.status(404).json({ error: 'resource not found' })
        }
      case 'string':
        try {
          const user = await userRepository.findOneOrFail({
            where: {
              username: Like(`%${query}%`)
            }
          })
          return res.status(200).json(user)
        } catch (error) {
          return res.status(404).json({ error: 'resource not found' })
        }
    }
  }

  removeValidator = {
    params: {
      id: [Joi.string().required(), Joi.number().required()]
    }
  }

  async remove(req: Request, res: Response): Promise<Response> {
    const { id } = req.params

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

export default new AdminController()
