import { ValidationError as ClassValidationError } from 'class-validator'
import { StatusCodes } from 'http-status-codes'
import { BaseError } from '../BaseError'
import { IErrorResponse } from '../IErrorResponse'

type ValidationMessage = Array<ClassValidationError> | Array<string>

interface IValidationErrorResponse extends IErrorResponse {
  validationMessages: Array<string>
}

/**
 * Error for for validation failures
 * Has default HTTP status of BAD_REQUEST.
 */
export class ValidationError extends BaseError {
  private _validationMessages: Array<string> = []

  constructor(
    { message, validation, httpStatus }: { message: string; validation: ValidationMessage; httpStatus: number } = {
      message: 'Validation error',
      validation: [],
      httpStatus: StatusCodes.BAD_REQUEST
    }
  ) {
    super({ message, httpStatus })
    this.setValidationMessages(validation)
  }

  /**
   * Sets the validation message from provided array of validation messags and class validation errors.
   * If the array is empty, a default response message is set.
   * @param validation array of validation messages and/or class validation messages
   */
  private setValidationMessages(validation: ValidationMessage) {
    if (validation.length === 0) return this.setDefaultMessage()
    this._validationMessages = this.createValidationMessages(validation)
  }

  /**
   * Creates the validation message array of messages and returns it.
   * It sorts out ValidationErrors from class validator and extracts the messages from it. Regular
   * array list of message is merged to create a single array of messages
   * @param validations array of validation messages and/or class validation messages
   */
  private createValidationMessages(validations: ValidationMessage) {
    const messages: Array<string> = []
    for (const message of validations) {
      if (message instanceof ClassValidationError) {
        for (const key in message.constraints) {
          if (Object.prototype.hasOwnProperty.call(message.constraints, key)) {
            const constraintMessage: string = (message.constraints as any)[key]
            messages.push(constraintMessage)
          }
        }
      } else {
        messages.push(message)
      }
    }
    return messages
  }
  /**
   * Adds a default message to the validation messages
   */
  private setDefaultMessage() {
    this._validationMessages.push('Failed to validate request')
  }

  toResponse(): IValidationErrorResponse {
    return { ...super.toResponse(), validationMessages: this._validationMessages }
  }
}
