import { NextFunction } from 'connect'
import { Request, Response } from 'express'
import { NotAcceptableError } from '@/lib/errors/http/NotAcceptableError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
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
      throw new NotAcceptableError({ message: ServerErrorMessage.wrongContentType('application/json') })
    }
  } catch (error) {
    next(error)
  }

  next()
}
