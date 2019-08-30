import * as nodemailer from 'nodemailer'
import { pugEngine } from 'nodemailer-pug-engine'
import { join } from 'path'

const mailer = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
} as nodemailer.TransportOptions)

mailer.use(
  'compile',
  pugEngine({
    templateDir: join(__dirname, '/templates'),
    pretty: true
  })
)

export default mailer
