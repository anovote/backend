import { IErrorMessage } from './IErrorMessage'

interface ServerErrorMessages extends IErrorMessage {
  unexpected: () => string
  notFound: (entity: string) => string
  unauthorized: () => string
  forbidden: () => string
}

export const ServerErrorMessage: ServerErrorMessages = {
  unexpected: () => 'Unexpected server error',
  notFound: (entity: string) => `${entity} not found`,
  unauthorized: () => 'You are unauthorized, please login',
  forbidden: () => 'You are forbidden to access this resource'
}
