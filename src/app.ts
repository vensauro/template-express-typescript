import * as express from 'express'

import 'reflect-metadata'
import { createConnection } from 'typeorm'

import * as bodyParser from 'body-parser'

import * as Sentry from '@sentry/node'
import * as Youch from 'youch'
import * as validate from 'express-validation'

import Routes from './app/routes'

class App {
  private express: express.Application

  private isDev: boolean

  private constructor() {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    this.sentry()
    this.middlewares()
    this.routes()
    this.exception()
  }

  static async init(): Promise<express.Application> {
    await createConnection()
    const app = new App()
    return app.express
  }

  private sentry(): void {
    Sentry.init()
  }

  private middlewares(): void {
    this.express.use(bodyParser.json())
  }

  private routes(): void {
    this.express.use(Routes)
  }

  private exception(): void {
    if (process.env.NODE_ENV === 'production') {
      this.express.use(Sentry.Handlers.errorHandler())
    }

    this.express.use(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async (err: any, req: express.Request, res: express.Response, _) => {
        if (err instanceof validate.ValidationError) {
          validate.options({
            status: 422,
            statusText: 'Unprocessable Entity'
          })
          return res.status(err.status).json(err)
        }

        if (process.env.NODE_ENV !== 'production') {
          const youch = new Youch(err, req)
          if (req.accepts('html')) return res.send(await youch.toHTML())
          else return res.json(await youch.toJSON())
        }

        return res
          .status(err.status || 500)
          .json({ error: 'Internal Server Error' })
      }
    )
  }
}

export default App
