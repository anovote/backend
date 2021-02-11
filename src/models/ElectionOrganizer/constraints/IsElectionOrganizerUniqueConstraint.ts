import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator'
import { getRepository } from 'typeorm'
import { ElectionOrganizer } from '..'

@ValidatorConstraint({ async: true })
export class IsElectionOrganizerUniqueConstraint implements ValidatorConstraintInterface {
  validate(email: any, args: ValidationArguments) {
    return getRepository(ElectionOrganizer)
      .findOne({ email: email })
      .then((electionOrganizer) => {
        if (electionOrganizer) return false
        return true
      })
  }
}

export function IsElectionOrganizerUnique(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsElectionOrganizerAlreadyExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsElectionOrganizerUniqueConstraint
    })
  }
}
