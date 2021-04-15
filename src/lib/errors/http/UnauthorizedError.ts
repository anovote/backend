import { StatusCodes } from 'http-status-codes'
import { BaseError } from '../BaseError'
import { ErrorCode } from '../ErrorCodes'
import { ServerErrorMessage } from '../messages/ServerErrorMessages'

/**
 * Unauthorized error has default status code of 401
 */
export class UnauthorizedError extends BaseError {
    constructor(
        { message, code }: { message: string; code?: ErrorCode } = { message: ServerErrorMessage.unauthorized() }
    ) {
        super({ message, httpStatus: StatusCodes.UNAUTHORIZED, code })
    }
}
