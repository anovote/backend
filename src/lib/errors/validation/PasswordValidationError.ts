import { BadRequestError } from '../http/BadRequestError'
import { ServerErrorMessage } from '../messages/ServerErrorMessages'

export class PasswordValidationError extends BadRequestError {
    constructor() {
        super({ message: ServerErrorMessage.weakPassword(), code: 'PASSWORD_CRITERIA' })
    }
}
