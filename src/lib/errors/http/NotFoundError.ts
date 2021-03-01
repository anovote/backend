import { StatusCodes } from 'http-status-codes'
import { BaseError } from '../BaseError'

/**
 * A message must be provided to not found error
 * Not found error has default http status code of 404
 */
export class NotFoundError extends BaseError {
    constructor({ message }: { message: string }) {
        super({ message: message, httpStatus: StatusCodes.NOT_FOUND })
    }
}
