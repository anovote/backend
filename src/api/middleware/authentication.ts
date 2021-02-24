import express from '@/loaders/express'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { AuthenticationService } from '@/services/AuthenticationService'
import { ElectionOrganizerService } from '@/services/ElectionOrganizerService'
import { NextFunction, Request, Response } from 'express'
import { getConnection } from 'typeorm'
/**
 * Verifies if a token is passed along with the request.
 * Checks if the request have the rights to access the route.
 * @export
 * @param ctx access to the route information
 * @param next call next middleware/route
 */
export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  const db = getConnection()
  const authenticationService = new AuthenticationService()
  const electionOrganizerService = new ElectionOrganizerService(db)
  try {
    const id = (await authenticationService.verifyToken(req.headers.authorization)).id
    const electionOrganizer = await electionOrganizerService.getElectionOrganizerById(id)
    req.electionOrganizer = electionOrganizer
  } catch (e) {
    next(e)
  }

  next()
}

declare global {
  namespace Express {
    interface Request {
      electionOrganizer: ElectionOrganizer
    }
  }
}
