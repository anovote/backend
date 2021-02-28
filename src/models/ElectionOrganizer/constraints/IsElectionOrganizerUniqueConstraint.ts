import { ValidationErrorMessage } from '@/lib/errors/messages/ValidationErrorMessages'
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'
import { getRepository } from 'typeorm'
import { ElectionOrganizer } from '../ElectionOrganizerEntity'

@ValidatorConstraint({ async: true })
export class IsElectionOrganizerUniqueConstraint implements ValidatorConstraintInterface {
  async validate(email: string) {
    const electionOrganizer = await getRepository(ElectionOrganizer).findOne({ email: email })
    if (electionOrganizer) return false
    return true
  }

  defaultMessage() {
    return ValidationErrorMessage.alreadyExists('Email')
  }
}

export function IsElectionOrganizerUnique(validationOptions?: ValidationOptions) {
  return function (object: Record<string, unknown>, propertyName: string) {
    registerDecorator({
      async: true,
      name: 'IsElectionOrganizerAlreadyExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsElectionOrganizerUniqueConstraint
    })
  }
}
