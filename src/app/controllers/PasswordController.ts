import * as crypto from 'crypto'
import { addHours } from 'date-fns'
import { Request, Response } from 'express'
import * as Joi from 'joi'
import { PasswordReset, User } from 'models/database/entity'
import mailer from 'models/services/Mail/Mail'
import * as nodemailer from 'nodemailer'
import { getRepository } from 'typeorm'

class PasswordController {
  forgotValidator = {
    body: {
      email: Joi.string()
        .email()
        .required()
    }
  }

  async forgot(req: Request, res: Response): Promise<Response> {
    const { email } = req.body

    // if user not exists, an error will explode
    const user = await User.repository().findOneOrFail({ email })

    const token = crypto.randomBytes(20).toString('hex')
    const expires_on = addHours(new Date(), 5)

    const passwordRep = getRepository(PasswordReset)

    const resetPassword = await passwordRep.findOne({ email })
    if (!resetPassword) {
      await passwordRep.save(new PasswordReset({ email, token, expires_on }))
    }

    await passwordRep.update({ email }, { email, token, expires_on })

    await mailer.sendMail({
      to: email,
      from: 'ivis@test.oco',
      template: 'forgot_password',
      ctx: { token, user }
    } as nodemailer.SendMailOptions)

    return res.status(200).json({ message: 'mail send with sucess' })
  }

  updateValidator = {
    body: {
      email: Joi.string()
        .email()
        .required(),
      token: Joi.string()
        .hex()
        .required(),
      password: Joi.string()
        .min(6)
        .max(20)
        .alphanum()
        .required()
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { email, token, password } = req.body

    const recovery = await getRepository(PasswordReset).findOneOrFail({
      email
    })

    if (recovery.token !== token) {
      return res.status(409).json({ error: 'Invalid data' })
    }

    if (new Date() > recovery.expires_on) {
      return res.status(401).json({ error: 'Expired data' })
    }

    const user = await User.repository().findOneOrFail({ email })
    user.password = password
    User.repository().save(user)

    return res.status(201).json(user)
  }
}

export default new PasswordController()
