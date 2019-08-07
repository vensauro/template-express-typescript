import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'

export async function checkJwt(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' })
  }

  const [, token] = authHeader.split(' ')

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    res.locals.jwtPayload = decoded
    return next()
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid' })
  }
}
