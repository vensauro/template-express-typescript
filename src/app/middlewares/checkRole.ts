import { NextFunction, RequestHandler, Response } from 'express'
import { UserRole } from 'models/database/entity'

export function checkRole(roles: UserRole[]): RequestHandler {
  return async function(
    _,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    if (!res.locals.jwtPayload) {
      res.status(401).json({ error: 'Not logged' })
    }

    const { role } = res.locals.jwtPayload.user

    if (roles.includes(role)) return next()
    else return res.status(403).json({ error: 'Unauthorized' })
  }
}
