import { ForbiddenError } from '@/lib/errors/http/ForbiddenError'
import { StatusCodes } from 'http-status-codes'

it('should have http status code 403', () => {
  const error = new ForbiddenError()
  expect(error.httpStatus).toBe(StatusCodes.FORBIDDEN)
})
