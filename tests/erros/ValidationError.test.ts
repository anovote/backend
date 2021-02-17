import { ValidationError } from '@/lib/error/validation/ValidationError'

it('should have default http status code of 400', async () => {
  const error = new ValidationError()
  expect(error.httpStatus).toBe(400)
})

it('should return validation error messages in response', async () => {
  const missing = 'missing'
  const required = 'required'
  const validationMessages = [required, missing]
  const error = new ValidationError({ message: 'test', httpStatus: 400, validation: validationMessages })
  expect(error.toResponse().validationMessages).toEqual(validationMessages)
})
