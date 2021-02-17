import { NextFunction } from 'connect'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

/**
 * Enforces content type json
 * Middelware can be used on any endpoint.
 *
 * Example to add middleware:
 * `router.use(enforceContentTypeJson)`
 * @param request
 * @param response
 * @param next
 */
export function enforceContentTypeJson(request: Request, response: Response, next: NextFunction) {
  try {
    if (!request.is('json') && request.method != 'GET' && request.method != 'DELETE') {
      // TODO send Wrong Content Type error from here
      throw new Error('Wrong Content-type')
    }
  } catch (error) {
    next(error)
  }

  next()
}
