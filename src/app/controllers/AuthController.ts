import { User } from 'app/database/entity/User'
import { Request, Response } from 'express'
import * as Joi from 'joi'
import { getRepository } from 'typeorm'

class AuthController {
  private userRepository = getRepository(User)

  loginValidator = {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { email }
      })

      if (!user.checkIfUnencryptedPasswordIsValid(password)) {
        return res.status(401).json({ error: 'Incorrect email or password' })
      }

      const token = user.generateToken()

      return res.status(200).json({
        token,
        user
      })
    } catch (error) {
      return res.status(404).json({ error: 'Resource not found' })
    }
  }
}

export default new AuthController()
