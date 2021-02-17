import { UnauthorizedError } from '@/lib/error/http/UnauthorizedError'
import { StatusCodes } from 'http-status-codes'

it('should have http status code 401', async () => {
  const error = new UnauthorizedError()
  expect(error.httpStatus).toBe(StatusCodes.UNAUTHORIZED)
})
