import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { StatusCodes } from 'http-status-codes'

it('should have http status code 404', () => {
  const error = new NotFoundError({ message: '' })
  expect(error.httpStatus).toBe(StatusCodes.NOT_FOUND)
})
