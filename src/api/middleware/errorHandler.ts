import { NotFoundError } from '@/lib/Errors/NotFoundError'
import { logger } from '@/loaders/logger'
import { NextFunction, Request, Response } from 'express'
import HttpStatusCodes from 'http-status-codes'

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message)

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error: {
        status: 404,
        name: err.name,
        message: err.message,
        original: err
      }
    })
  }

  return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json('waiting for christoffer to add more errors')
}
