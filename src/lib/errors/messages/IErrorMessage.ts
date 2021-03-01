/**
 * Describes an error message object that
 * can resolve messages from functions taking any
 * length of arguments
 */
export interface IErrorMessage {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (...args: Array<string>) => string
}
