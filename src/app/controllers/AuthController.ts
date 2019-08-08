import { User } from 'app/database/entity/User'
import { Request, Response } from 'express'
import * as Joi from 'joi'
import { getRepository } from 'typeorm'

class AuthController {
  loginValidator = {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body

    const userRepository = getRepository(User)

    const user = await userRepository.findOne({
      where: { email: email },
      select: ['id', 'username', 'email', 'password', 'role']
    })

    if (!user) return res.status(404).json({ error: 'Resource not found' })

    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      return res.status(401).json({ error: 'Incorrect email or password' })
    }

    const token = user.generateToken()

    const UserResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }

    return res.status(200).json({
      token,
      user: UserResponse
    })
  }
}

export default new AuthController()
