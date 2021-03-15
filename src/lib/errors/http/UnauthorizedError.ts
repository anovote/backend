import { StatusCodes } from 'http-status-codes'
import { BaseError } from '../BaseError'
import { ServerErrorMessage } from '../messages/ServerErrorMessages'

/**
 * Unauthorized error has default status code of 401
 */
export class UnauthorizedError extends BaseError {
    constructor(
        { message, code }: { message: string; code?: string } = { message: ServerErrorMessage.unauthorized() }
    ) {
        super({ message, httpStatus: StatusCodes.UNAUTHORIZED, code })
    }
}
