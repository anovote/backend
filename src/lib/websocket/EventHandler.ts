import { AnoSocket } from '@/lib/websocket/AnoSocket'
import { Server } from 'socket.io'
import { AcknowledgeResponse } from './AcknowledgeResponse'

// Arguments for a websocket event
export interface IEventArguments<T> {
    // Data received for this event
    data: T
    // The client socket receiving the event
    client: AnoSocket
    // The server socket instance
    server: Server
}
export interface IEventAcknowledgeArguments<T> extends IEventArguments<T> {
    // acknowledgement callback to the client
    acknowledgement: (arg: AcknowledgeResponse) => void
}
/**
 * Handles an event
 * @param data the data object passed along the event from the client
 * @param socket the socket the event exists on, can be used to get information about the socket connection or emit new events
 */
export type EventHandler<T> = (event: IEventArguments<T>) => void

/**
 * Handles an event that should respond with an acknowledgement
 * @param data the data object passed along the event from the client
 * @param socket the socket the event exists on, can be used to get information about the socket connection or emit new events
 * @param acknowledgement the callback to respond to an event with
 */
export type EventHandlerAcknowledges<T> = (event: IEventAcknowledgeArguments<T>) => void
