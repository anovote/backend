import { BaseError } from '@/lib/errors/BaseError'
import { BadRequestError } from '@/lib/errors/http/BadRequestError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { logger } from '@/loaders/logger'
import { NextFunction, Request, Response } from 'express'
import HttpStatusCodes from 'http-status-codes'
import { QueryFailedError } from 'typeorm'

export const errorHandler = (err: Error, _: Request, res: Response, __: NextFunction) => {
  logger.error(err)

  if (err instanceof BaseError) {
    return res.status(err.httpStatus).json(err.toResponse())
  }

  if (err instanceof QueryFailedError) {
    const error = new BadRequestError({ message: ServerErrorMessage.invalidData() })
    return res.status(error.httpStatus).json(error.toResponse())
  }

  return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json('Something went wrong.. Try again later')
}
