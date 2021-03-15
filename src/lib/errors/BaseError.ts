import { StatusCodes } from 'http-status-codes'
import { ServerErrorMessage } from './messages/ServerErrorMessages'
import { IErrorResponse } from './IErrorResponse'
import { ErrorCode } from './ErrorCodes'

/**
 * Top level error object for the application specific errors
 * Contains a message, httpStatus, error code.
 * Provides method for getting the error as JSON
 */
export class BaseError extends Error {
    private _httpStatus: number = StatusCodes.INTERNAL_SERVER_ERROR
    // More specific error code
    private _code: string = ErrorCode.unexpected

    constructor({ message, httpStatus, code }: { message?: string; httpStatus?: StatusCodes; code?: string } = {}) {
        super(message ? message : ServerErrorMessage.unexpected())
        if (httpStatus) this._httpStatus = httpStatus
        if (code) this._code = code
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
