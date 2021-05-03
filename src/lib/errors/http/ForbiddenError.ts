import { StatusCodes } from 'http-status-codes'
import { BaseError } from '../BaseError'
import { ErrorCode } from '../ErrorCodes'
import { ServerErrorMessage } from '../messages/ServerErrorMessages'

/**
 * Forbidden error has default http status code of 403
 */
export class ForbiddenError extends BaseError {
    constructor(
        { message, code }: { message: string; code?: ErrorCode } = { message: ServerErrorMessage.forbidden() }
    ) {
        super({ message, httpStatus: StatusCodes.FORBIDDEN, code })
    }
}
