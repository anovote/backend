import { StatusCodes } from 'http-status-codes'
import { BaseError } from '../BaseError'
import { ServerErrorMessage } from '../messages/ServerErrorMessages'

/**
 * Forbidden error has default http status code of 403
 */
export class ForbiddenError extends BaseError {
    constructor({ message, code }: { message: string; code?: string } = { message: ServerErrorMessage.forbidden() }) {
        super({ message, httpStatus: StatusCodes.FORBIDDEN, code })
    }
}
