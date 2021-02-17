import { IErrorMessage } from './IErrorMessage'

interface ServerErrorMessages extends IErrorMessage {
  unexpected: () => string
}

export const ServerErrorMessage: ServerErrorMessages = {
  unexpected: () => 'Unexpected server error'
}
