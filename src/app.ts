import 'dotenv/config'
import 'reflect-metadata'

import * as Sentry from '@sentry/node'
import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as validate from 'express-validation'
import { createConnection } from 'typeorm'
import * as Youch from 'youch'

import Routes from './app/routes'

class App {
  private express: express.Application

  private isDev: boolean

  private constructor() {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    // this.sentry()
    this.middlewares()
    this.routes()
    this.exception()
  }

  getExpress(): express.Application {
    return this.express
  }

  static async init(): Promise<express.Application> {
    try {
      await createConnection()
      const app = new App()
      return app.express
    } catch (e) {
      console.error(e)
      console.error("Can't connect with database")
    }
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
      // this.express.use(Sentry.Handlers.errorHandler())
    }

    this.express.use(async (
      err: any,
      req: express.Request,
      res: express.Response,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      next: express.NextFunction
    ) => {
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
    })
  }
}

export default App
