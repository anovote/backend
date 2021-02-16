export class ValidationError extends Error {
  constructor(message: string | undefined) {
    super(message)
  }
}
