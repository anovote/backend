import { BaseError } from '@/lib/errors/BaseError'
import { StatusCodes } from 'http-status-codes'

it('should return internal server error as default http status', async () => {
  const error = new BaseError()
  expect(error.toResponse().status).toBe('INTERNAL_SERVER_ERROR')
})

it('should return set message in response message', async () => {
  const message = 'test message'
  const error = new BaseError({ message, httpStatus: 200 })
  expect(error.toResponse().message).toBe(message)
})

it('should return http status code as http status name for code', async () => {
  const statusNameUnauthorized = 'UNAUTHORIZED'
  const statusNameNotFound = 'NOT_FOUND'

  const errorUnauthorized = new BaseError({ message: '', httpStatus: StatusCodes.UNAUTHORIZED })
  const errorNotFound = new BaseError({ message: '', httpStatus: StatusCodes.NOT_FOUND })

  expect(errorUnauthorized.toResponse().status).toBe(statusNameUnauthorized)
  expect(errorNotFound.toResponse().status).toBe(statusNameNotFound)
})
