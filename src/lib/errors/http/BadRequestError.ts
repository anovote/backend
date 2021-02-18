import { StatusCodes } from 'http-status-codes'
import { BaseError } from '../BaseError'

/**
 * A message must be provided for the bad request error.
 * Bad request error has default http status code of 400
 */
export class BadRequestError extends BaseError {
  constructor({ message }: { message: string }) {
    super({ message: message, httpStatus: StatusCodes.BAD_REQUEST })
  }
}
