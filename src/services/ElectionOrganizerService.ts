import { validateEntity } from '@/helpers/validateEntity'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { ElectionOrganizerRepository } from '@/models/ElectionOrganizer/ElectionOrganizerRepository'
import { IElectionOrganizer } from '@/models/ElectionOrganizer/IElectionOrganizer'
import { classToClass } from 'class-transformer'
import { Connection, getCustomRepository } from 'typeorm'
import BaseEntityService from './BaseEntityService'
import { EncryptionService } from './EncryptionService'

export class ElectionOrganizerService extends BaseEntityService<ElectionOrganizer> {
    private _database: Connection
    private _organizerRepository: ElectionOrganizerRepository

    constructor(db: Connection) {
        super(db, ElectionOrganizer)
        this._database = db
        this._organizerRepository = this._database.getCustomRepository(ElectionOrganizerRepository)
    }

    get(): Promise<ElectionOrganizer[] | undefined> {
        throw new NotFoundError({ message: 'Not found' })
    }

    async getById(id: number): Promise<ElectionOrganizer | undefined> {
        return classToClass(await this.getElectionOrganizerById(id))
    }

    async create(dto: ElectionOrganizer): Promise<ElectionOrganizer | undefined> {
        return classToClass(await this.createAndSaveElectionOrganizer(dto))
    }

    async update(id: number, dto: ElectionOrganizer): Promise<ElectionOrganizer | undefined> {
        return classToClass(await this.updatePassword(dto.password, id))
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
        const saved = await this._organizerRepository.save(electionOrganizer)
        return saved
    }

    async createAndSaveElectionOrganizer(electionOrganizer: IElectionOrganizer): Promise<ElectionOrganizer> {
        const encryptionService = new EncryptionService()

        const organizer = this.createElectionOrganizer(electionOrganizer)

        await validateEntity(organizer)
        organizer.password = await encryptionService.hash(organizer.password)

        return await this.save(organizer)
    }

    /**
     * Updates the password of a election organizer
     * @param newPassword The password we want to change to
     * @param id The id of the election organizer who is changing its password
     */
    async updatePassword(newPassword: string, id: number) {
        const encryptionService = new EncryptionService()

        const electionOrganizer: ElectionOrganizer | undefined = await this._organizerRepository.findOne({
            id
        })

        if (!electionOrganizer) {
            throw new NotFoundError({ message: ServerErrorMessage.notFound('Election organizer') })
        }

        electionOrganizer.password = await encryptionService.hash(newPassword)
        const updatedElectionOrganizer = await this._organizerRepository.save(electionOrganizer)
        return updatedElectionOrganizer
    }

    /**
     * Returns the election organizer with the specified id.
     * Throws an RangeError if the election organizer is not found
     * @param id The id of the election organizer
     */
    async getElectionOrganizerById(id: number): Promise<ElectionOrganizer> {
        const repository = getCustomRepository(ElectionOrganizerRepository)

        const electionOrganizer: ElectionOrganizer | undefined = await repository.findOne({ id })

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
