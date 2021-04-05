import { IErrorResponseMessage, IResponseMessage } from './EventResponse'

/**
 * The callback object an event with acknowledge should contain
 */
export type AcknowledgeResponse = IResponseMessage | IErrorResponseMessage
