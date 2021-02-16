export class CreateError extends Error {
  constructor(message: string | undefined) {
    super(message)
  }
}
