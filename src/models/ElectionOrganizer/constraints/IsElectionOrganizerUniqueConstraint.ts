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
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (object: object, propertyName: string) {
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
