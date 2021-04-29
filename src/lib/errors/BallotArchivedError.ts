import { BadRequestError } from './http/BadRequestError'
import { ServerErrorMessage } from './messages/ServerErrorMessages'

export class BallotArchivedError extends BadRequestError {
    constructor() {
        super({ message: ServerErrorMessage.ballotArchived(), code: 'BALLOT_ARCHIVED' })
    }
}
