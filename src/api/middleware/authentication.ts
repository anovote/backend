import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { AuthenticationService } from '@/services/AuthenticationService'
import { ElectionOrganizerService } from '@/services/ElectionOrganizerService'
import { EligibleVoterService } from '@/services/EligibleVoterService'
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
        const id = authenticationService.verifyToken(req.headers.authorization).id
        const electionOrganizer = await electionOrganizerService.getById(id)
        req.electionOrganizer = electionOrganizer!
    } catch (e) {
        next(e)
    }

    next()
}

/**
 * Verifies that a request contains a valid token, and verifies that the owner of the token
 * exists.
 */
export const hasValidTokenAndExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const db = getConnection()
        const authenticationService = new AuthenticationService()
        const { id, organizer } = authenticationService.verifyToken(req.headers.authorization)
        if (organizer === true) {
            const electionOrganizerService = new ElectionOrganizerService(db)
            await electionOrganizerService.getById(id)
        } else {
            const voterService = new EligibleVoterService(db)
            await voterService.getById(id)
        }
    } catch (e) {
        next(e)
    }

    next()
}
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            electionOrganizer: ElectionOrganizer
        }
    }
}
