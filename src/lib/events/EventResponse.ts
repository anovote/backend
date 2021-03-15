import { BaseError } from '@/lib/errors/BaseError'
import { IErrorResponse } from '../errors/IErrorResponse'

export interface IResponseMessage {
    data: unknown
}

export interface IErrorResponseMessage {
    error: IErrorResponse
}
/**
 * Creates a response message to be sent to client
 * @param data data to send in event
 * @returns returns data object
 */
export const EventMessage = (data: unknown) => {
    return {
        data
    }
}

/**
 * Creates a error response object to be sent to client
 * @param error error to send in event
 * @returns returns error message object
 */
export const EventErrorMessage = (error: BaseError) => {
    return {
        error: error.toResponse()
    }
}
