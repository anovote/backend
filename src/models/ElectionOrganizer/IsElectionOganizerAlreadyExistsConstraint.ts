import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator'
import { getCustomRepository, getRepository } from 'typeorm'
import { ElectionOrganizer } from '.'
import { ElectionOrganizerRepository } from '../../Repositores/ElectionOrganizerRepository'

@ValidatorConstraint({ async: true })
export class IsElectionOrganizerAlreadyExistsConstraint implements ValidatorConstraintInterface {
  validate(email: any, args: ValidationArguments) {
    return getRepository(ElectionOrganizer)
      .find({ where: { email: email } })
      .then((electionOrganizer) => {
        if (electionOrganizer) return false
        return true
      })
  }
}

export function IsElectionOrganizerAlreadyExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsElectionOrganizerAlreadyExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsElectionOrganizerAlreadyExistsConstraint
    })
  }
}
