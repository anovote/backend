import { BadRequestError } from './http/BadRequestError'
import { ServerErrorMessage } from './messages/ServerErrorMessages'

export class AlreadyVotedError extends BadRequestError {
    constructor() {
        super({ message: ServerErrorMessage.alreadyVotedOnBallot(), code: 'ALREADY_VOTED_ON_BALLOT' })
    }
}
