import { BadRequestError } from '@/lib/errors/http/BadRequestError'
import { StatusCodes } from 'http-status-codes'

it('should have http status code 400', () => {
  const error = new BadRequestError({ message: 'message' })
  expect(error.httpStatus).toBe(StatusCodes.BAD_REQUEST)
})
