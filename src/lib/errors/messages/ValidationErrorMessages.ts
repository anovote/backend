import { IErrorMessage } from './IErrorMessage'

interface ValidationErrorMessages extends IErrorMessage {
  alreadyExists: (entity: string) => string
}

export const ValidationErrorMessage: ValidationErrorMessages = {
  alreadyExists: (entity: string) => `${entity} already exists`
}
