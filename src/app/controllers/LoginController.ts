import { Request, Response } from 'express'
import * as Joi from 'joi'
import { User } from 'models/database/entity'

class LoginController {
  loginValidator = {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body

    const user = await User.repository().findOne({
      where: { email: email },
      select: ['id', 'username', 'email', 'password', 'role']
    })

    if (!user)
      return res.status(401).json({ error: 'Incorrect email or password' })

    if (!user.checkIfUnencryptedPasswordIsValid(password))
      return res.status(401).json({ error: 'Incorrect email or password' })

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

export default new LoginController()
