import * as request from 'supertest'
import { getConnection } from 'typeorm'

import server from '../../src/app'
import factory from '../factories'

describe('authentication of a user in te app', () => {
  let app: Express.Application

  beforeAll(async () => {
    app = await server.init().then(res => res.getExpress())
  })

  afterAll(async () => {
    await getConnection().close()
  })

  it('should return 200 when login', async () => {
    const [user] = await factory()

    const response = await request(app)
      .post('/auth/login')
      .send({
        email: user.email,
        password: user.password
      })

    expect(response.status).toBe(200)
  })
})
