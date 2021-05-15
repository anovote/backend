import { ElectionOrganizerUpdateDTO, IElectionOrganizerUpdateDTO } from '@/dto/ElectionOrganizerUpdateDTO'
import { isEmailValid } from '@/helpers/email'
import { RegularExpressionLibrary } from '@/helpers/regExpressionLibrary'
import { jsonToObject } from '@/helpers/sanitize'
import { validateEntity } from '@/helpers/validateEntity'
import { BadRequestError } from '@/lib/errors/http/BadRequestError'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { PasswordValidationError } from '@/lib/errors/validation/PasswordValidationError'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { ElectionOrganizerRepository } from '@/models/ElectionOrganizer/ElectionOrganizerRepository'
import { IElectionOrganizer } from '@/models/ElectionOrganizer/IElectionOrganizer'
import { classToClass } from 'class-transformer'
import { Connection } from 'typeorm'
import BaseEntityService from './BaseEntityService'
import { HashService } from './HashService'

export class ElectionOrganizerService extends BaseEntityService<ElectionOrganizer> {
    private _organizerRepository: ElectionOrganizerRepository

    constructor(db: Connection) {
        super(db, ElectionOrganizer)
        this._organizerRepository = db.getCustomRepository(ElectionOrganizerRepository)
    }

    get(): Promise<ElectionOrganizer[] | undefined> {
        throw new NotFoundError({ message: ServerErrorMessage.notFound('Election organizer') })
    }

    async getById(id: number): Promise<ElectionOrganizer | undefined> {
        return classToClass(await this.getElectionOrganizerById(id))
    }

    async create(dto: ElectionOrganizer): Promise<ElectionOrganizer | undefined> {
        return classToClass(await this.createAndSaveElectionOrganizer(dto))
    }

    async update(id: number, dto: ElectionOrganizerUpdateDTO): Promise<ElectionOrganizer | undefined> {
        return classToClass(await this.updateById(dto, id))
    }

    /**
     * Creates an election organizer entity from a given election organizer model
     * @param electionOrganizer
     */
    private createElectionOrganizer(electionOrganizer: IElectionOrganizer): ElectionOrganizer {
        return this._organizerRepository.createElectionOrganizer(electionOrganizer)
    }

    /**
     * Saves an given election organizer to the database and returns it
     * @param electionOrganizer the election organizer we want to save
     */
    private async save(electionOrganizer: ElectionOrganizer): Promise<ElectionOrganizer> {
        return await this._organizerRepository.save(electionOrganizer)
    }

    async createAndSaveElectionOrganizer(electionOrganizer: IElectionOrganizer): Promise<ElectionOrganizer> {
        const organizer = this.createElectionOrganizer(electionOrganizer)

        this.checkPlaintextPasswordPattern(electionOrganizer.password)

        await validateEntity(organizer)

        const encryptionService = new HashService()
        organizer.password = await encryptionService.hash(organizer.password)

        return await this.save(organizer)
    }

    checkPlaintextPasswordPattern(plaintextPassword: string) {
        const passwordRegExp = RegularExpressionLibrary.passwordRegExp
        if (!passwordRegExp.test(plaintextPassword)) throw new PasswordValidationError()
    }

    /**
     * Updates the election organizer data for the database
     * @param organizerDTO the new organizer data transfer object to update
     * @param id the id of the organizer
     * @returns The updated election organizer
     */
    async updateById(organizerUpdateDTO: IElectionOrganizerUpdateDTO, id: number): Promise<ElectionOrganizer> {
        const organizerUpdate = jsonToObject(ElectionOrganizerUpdateDTO, organizerUpdateDTO)

        if (organizerUpdate?.password) {
            this.checkPlaintextPasswordPattern(organizerUpdate.password)
            const encryptionService = new HashService()
            organizerUpdate.password = await encryptionService.hash(organizerUpdate.password)
        }

        if (organizerUpdate?.email && !isEmailValid(organizerUpdate.email)) {
            throw new BadRequestError({ message: ServerErrorMessage.invalidData() })
        }

        const organizer = await this.repository.findOne(id)
        if (!organizer) throw new NotFoundError({ message: ServerErrorMessage.notFound('Organizer') })

        const updatedOrganizer = this.repository.create({ ...organizer, ...organizerUpdate }!)
        await validateEntity(updatedOrganizer, { strictGroups: true })

        return await this.repository.save(updatedOrganizer)
    }

    /**
     * Returns the election organizer with the specified id.
     * Throws an RangeError if the election organizer is not found
     * @param id The id of the election organizer
     */
    async getElectionOrganizerById(id: number): Promise<ElectionOrganizer> {
        const electionOrganizer: ElectionOrganizer | undefined = await this.repository.findOne({ id })

        if (!electionOrganizer) {
            throw new NotFoundError({ message: ServerErrorMessage.notFound('Election organizer') })
        }

        return electionOrganizer
    }

    /**
     * Deletes a organizer by the given ID, if it exists,
     * Throws error if database, or query fails
     * @param id the id of the ballot to delete
     * @return the organizer or if it does not exist, undefined
     */
    async delete(id: number): Promise<void> {
        const existingOrganizer = await this._organizerRepository.findOne(id)
        if (!existingOrganizer) throw new NotFoundError({ message: ServerErrorMessage.notFound('Election Organizer') })
        await this._organizerRepository.remove(existingOrganizer)
    }
}
