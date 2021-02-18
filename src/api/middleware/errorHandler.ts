import { BaseError } from '@/lib/errors/BaseError'
import { logger } from '@/loaders/logger'
import { NextFunction, Request, Response } from 'express'
import HttpStatusCodes from 'http-status-codes'

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err)

  if (err instanceof BaseError) {
    return res.status(err.httpStatus).json(err.toResponse())
  }

  return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json('Something went wrong.. Try again later')
}
