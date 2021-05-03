import { StatusCodes } from 'http-status-codes'
import { BaseError } from '../BaseError'
import { ErrorCode } from '../ErrorCodes'

/**
 * A message must be provided for the bad request error.
 * Bad request error has default http status code of 400
 */
export class BadRequestError extends BaseError {
    constructor({ message, code }: { message: string; code?: ErrorCode }) {
        super({ message: message, httpStatus: StatusCodes.BAD_REQUEST, code })
    }
}
