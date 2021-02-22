import { ValidationErrorMessage } from '@/lib/errors/messages/ValidationErrorMessages'
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator'
import { getRepository } from 'typeorm'
import { ElectionOrganizer } from '../ElectionOrganizerEntity'

@ValidatorConstraint({ async: true })
export class IsElectionOrganizerUniqueConstraint implements ValidatorConstraintInterface {
  validate(email: string, args: ValidationArguments) {
    return getRepository(ElectionOrganizer)
      .findOne({ email: email })
      .then((electionOrganizer) => {
        if (electionOrganizer) return false
        return true
      })
  }

  defaultMessage() {
    return ValidationErrorMessage.alreadyExists('Email')
  }
}

export function IsElectionOrganizerUnique(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
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
