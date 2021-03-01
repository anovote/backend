/**
 * Describes an error message object that
 * can resolve messages from functions taking any
 * length of arguments
 */
export interface IErrorMessage {
    [key: string]: (...args: any[]) => string
}
