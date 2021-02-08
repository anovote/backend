import { AuthenticationService } from '@/services/AuthenticationService.ts'
import { NextFunction, Request, Response } from 'express'

/**
 * Verifies if a token is passed along with the request.
 * Checks if the request have the rights to access the route.
 * @export
 * @param ctx access to the route information
 * @param next call next middleware/route
 */
export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  const bearerSchema = req.headers.authorization
  try {
    await new AuthenticationService().verifyToken(bearerSchema)
  } catch (e) {
    res.sendStatus(403)
    // ! TODO throw more meaningful error
  }

  next()
}
