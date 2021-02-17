import { logger } from '@/loaders/logger'
import { NextFunction, Request, Response } from 'express'
import HttpStatusCodes from 'http-status-codes'

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message)

  if (err instanceof Error) {
    res.status(418).json({
      error: {
        status: 500,
        message: 'test',
        original: err
      }
    })
  }

  res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
}
