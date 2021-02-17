import { StatusCodes } from 'http-status-codes'
import { ServerErrorMessage } from './messages/ServerErrorMessages'
import { IErrorResponse } from './IErrorResponse'

/**
 * Top level error object for the application specific errors
 * Contains a message, httpStatus.
 * Provides method for getting the error as JSON
 */
export class BaseError extends Error {
  private _httpStatus: number = StatusCodes.INTERNAL_SERVER_ERROR

  constructor(
    { message, httpStatus }: { message: string; httpStatus: StatusCodes } = {
      message: ServerErrorMessage.unexpected(),
      httpStatus: StatusCodes.INTERNAL_SERVER_ERROR
    }
  ) {
    super(message)
    this._httpStatus = httpStatus
  }

  /**
   * Returns the status code text representation
   */
  private getStatusCodeName(): string {
    return StatusCodes[this._httpStatus]
  }

  /**
   * Returns the http status code for the error
   */
  get httpStatus(): number {
    return this._httpStatus
  }

  /**
   * Returns response object that can safely be returned
   * to the client
   */
  toResponse(): IErrorResponse {
    return {
      message: this.message,
      status: this.getStatusCodeName()
    }
  }
}
