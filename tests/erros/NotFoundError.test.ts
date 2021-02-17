import { NotFoundError } from '@/lib/error/http/NotFoundError'
import { StatusCodes } from 'http-status-codes'

it('should have http status code 404', async () => {
  const error = new NotFoundError({ message: '' })
  expect(error.httpStatus).toBe(StatusCodes.NOT_FOUND)
})
