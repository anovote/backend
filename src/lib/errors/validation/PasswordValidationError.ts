import { StatusCodes } from 'http-status-codes'
import { BaseError } from '../BaseError'

export class PasswordValidationError extends BaseError {
    constructor(message: string) {
        super({ message, httpStatus: StatusCodes.BAD_REQUEST, code: 'PASSWORD_CRITERIA' })
    }
}
