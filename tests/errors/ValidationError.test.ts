import { ValidationError } from '@/lib/errors/validation/ValidationError'

it('should have default http status code of 400', () => {
  const error = new ValidationError()
  expect(error.httpStatus).toBe(400)
})

it('should return validation error messages in response', () => {
  const missing = 'missing'
  const required = 'required'
  const validationMessages = [required, missing]
  const error = new ValidationError({ message: 'test', validation: validationMessages })
  expect(error.toResponse().validationMessages).toEqual(validationMessages)
})
