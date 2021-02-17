import { ForbiddenError } from '@/lib/error/http/ForbiddenError'
import { StatusCodes } from 'http-status-codes'

it('should have http status code 403', async () => {
  const error = new ForbiddenError()
  expect(error.httpStatus).toBe(StatusCodes.FORBIDDEN)
})
