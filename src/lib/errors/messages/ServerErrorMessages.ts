import { IErrorMessage } from './IErrorMessage'

interface ServerErrorMessages extends IErrorMessage {
    unexpected: () => string
    notFound: (entity: string) => string
    unauthorized: () => string
    noAuthorizationHeader: () => string
    invalidTokenFormat: () => string
    invalidToken: () => string
    invalidData: () => string
    forbidden: () => string
    wrongContentType: (validType: string) => string
}

export const ServerErrorMessage: ServerErrorMessages = {
    unexpected: () => 'Unexpected server error',
    notFound: (entity: string) => `${entity} not found`,
    unauthorized: () => 'You are unauthorized, please login',
    noAuthorizationHeader: () => 'No authorization header provided',
    invalidTokenFormat: () => 'Token format is invalid',
    invalidToken: () => 'Invalid token, please login again',
    invalidData: () => 'Invalid data',
    forbidden: () => 'You are forbidden to access this resource',
    wrongContentType: (validType: string) => `Wrong content type. Acceptable content type is: ${validType}`
}
