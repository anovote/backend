import { NotAcceptableError } from '@/lib/errors/http/NotAcceptableError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'

let error: NotAcceptableError

beforeAll(() => {
    error = new NotAcceptableError({ message: ServerErrorMessage.wrongContentType('application/json') })
})

it('should have default http status code of 406', () => {
    expect(error.httpStatus).toBe(406)
})

it('should return correct error messages in response', () => {
    const message = ServerErrorMessage.wrongContentType('application/json')
    expect(error.toResponse().message).toEqual(message)
})
