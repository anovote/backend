import { validate, ValidatorOptions } from 'class-validator'
import { ValidationError } from '@/lib/errors/validation/ValidationError'
/**
 * Validates an entity according to its entity constraints or throws an validation error
 * @param entity a entity to validate on
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const validateEntity = async (entity: object, validatorOptions?: ValidatorOptions) => {
    const validation = await validate(entity, validatorOptions)
    const isValid = validation.length === 0

    if (!isValid) {
        const name = validation[0].target?.constructor.name
        throw new ValidationError({ message: `Validation failed for ${name}`, validation: validation })
    }
}
