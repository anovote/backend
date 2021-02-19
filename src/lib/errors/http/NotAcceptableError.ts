import { StatusCodes } from 'http-status-codes'
import { BaseError } from '../BaseError'

/**
 * This error must provide a message
 * Not acceptable error has default http status code of 406
 */
export class NotAcceptableError extends BaseError {
  constructor({ message }: { message: string }) {
    super({ message: message, httpStatus: StatusCodes.NOT_ACCEPTABLE })
  }
}
