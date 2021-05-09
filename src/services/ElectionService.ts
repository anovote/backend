import { strip } from '@/helpers/sanitize'
import { validateEntity } from '@/helpers/validateEntity'
import { IHasOwner } from '@/interfaces/IHasOwner'
import { BadRequestError } from '@/lib/errors/http/BadRequestError'
import { ForbiddenError } from '@/lib/errors/http/ForbiddenError'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { Election } from '@/models/Election/ElectionEntity'
import { ElectionStatus } from '@/models/Election/ElectionStatus'
import { IElection } from '@/models/Election/IElection'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { SocketRoomEntity } from '@/models/SocketRoom/SocketRoomEntity'
import { classToClass } from 'class-transformer'
import { isAfter, isBefore } from 'date-fns'
import { Connection, Raw, Repository } from 'typeorm'
import BaseEntityService from './BaseEntityService'
import { EligibleVoterService } from './EligibleVoterService'
import { HashService } from './HashService'

export interface ElectionBody {
    title: string
    description: string
}

/**
 * Responsible for handling elections
 */
export class ElectionService extends BaseEntityService<Election> implements IHasOwner<Election> {
    private manager: Repository<Election>
    private readonly hashService: HashService
    owner: ElectionOrganizer | undefined
    private _eligibleVoterService: EligibleVoterService

    constructor(db: Connection, owner?: ElectionOrganizer) {
        super(db, Election)
        this.owner = owner
        this.manager = db.getRepository(Election)
        this.hashService = new HashService()
        this._eligibleVoterService = new EligibleVoterService(db)
    }

    async getById(id: number): Promise<Election | undefined> {
        return classToClass(await this.getElectionById(id))
    }

    async create(dto: IElection): Promise<Election | undefined> {
        return classToClass(await this.createElection(dto))
    }

    async update(id: number, dto: Election): Promise<Election | undefined> {
        return classToClass(await this.updateElectionById(id, dto))
    }

    async delete(id: number): Promise<void> {
        return classToClass(await this.deleteElectionById(id))
    }

    async get(): Promise<Election[] | undefined> {
        try {
            return classToClass(await this.getAllElections())
        } catch (error) {
            console.error(error)
        }
    }

    async getAllElections(): Promise<Election[] | undefined> {
        try {
            return await this.manager.find({
                where: {
                    electionOrganizer: this.owner
                }
            })
        } catch (err) {
            console.error(err)
        }
    }

    /**
     * Returns all started and not started elections
     * @returns return all started, and non started election
     */
    async getAllStartedAndNonStarted() {
        return await this.manager.find({
            where: [
                {
                    status: ElectionStatus.NotStarted
                },
                {
                    status: ElectionStatus.Started
                }
            ]
        })
    }

    /**
     * Returns all elections that should be started but is currently not started.
     * Determining whether an election should be started is done by checking the close date
     * @returns elections that is active/started but should be started
     */
    async getAllElectionsThatShouldBeStarted() {
        return await this.repository.find({
            openDate: Raw((open) => `${open} < NOW()`),
            status: ElectionStatus.NotStarted
        })
    }

    /**
     * Returns all elections that should be closed but is currently active/started.
     * Determining whether an election should be closed is done by checking the close date
     * @returns elections that is active/started but should be closed
     */
    async getAllElectionsThatShouldBeClosed() {
        return await this.repository.find({
            closeDate: Raw((close) => `${close} < NOW()`),
            status: ElectionStatus.Started
        })
    }

    /**
     * Starts an election by performing the necessary steps
     * @param election the election to start
     * @returns the started election
     */
    async beginElection(election: Election) {
        const updateElection = election
        if (!updateElection.openDate) {
            updateElection.openDate = new Date()
        }
        updateElection.isLocked = false
        updateElection.status = ElectionStatus.Started
        return await this.repository.save(updateElection)
    }

    async getElectionById(id: number): Promise<Election | undefined> {
        if (this.owner) {
            const election = await this.manager.findOne(id, {
                relations: ['electionOrganizer'],
                where: {
                    electionOrganizer: this.owner
                }
            })

            return election
        }

        return await this.manager.findOne(id)
    }

    /**
     * Checks the election status for the given election if the dates suggests the status should be finished or started.
     * After the checks the election will be updated for the db
     * @param election Election entity that is stored in the dn
     */
    private async checkElectionStatus(election: Election) {
        if (isAfter(new Date(), election.openDate!) || isBefore(new Date(), election.closeDate!)) {
            election.status = ElectionStatus.Started
            await this.updateElectionById(election.id, election)
        }

        if (isAfter(new Date(), election.closeDate!)) {
            await this.markElectionClosed(election, false)
        }
    }

    private async createElection(electionDTO: IElection): Promise<Election | undefined> {
        if (electionDTO.eligibleVoters) {
            electionDTO.eligibleVoters = this._eligibleVoterService.correctListOfEligibleVoters(
                electionDTO.eligibleVoters
            )
        }

        if (!this.owner) {
            throw new ForbiddenError()
        }
        electionDTO.electionOrganizer = this.owner!
        if (electionDTO.password) {
            await this.hashEntityPassword(electionDTO)
        }

        if (await this.isDuplicate(electionDTO)) {
            throw new BadRequestError({ message: 'Election already exists', code: 'ELECTION_DUPLICATE' })
        }

        const election = this.manager.create(electionDTO)

        // the mapping from json to election does not transform the date string into date type. Have to do it manually
        this.serializeDates(election)

        if (!election.socketRoom) {
            election.socketRoom = new SocketRoomEntity()
        }

        await validateEntity(election, { groups: ['creation'] })
        election.id = -1

        return await this.manager.save(election)
    }

    async updateElectionById(id: number, electionDTO: IElection): Promise<Election | undefined> {
        const existingElection = await this.manager.findOne(id, {
            where: {
                electionOrganizer: this.owner
            }
        })
        if (!existingElection) throw new NotFoundError({ message: ServerErrorMessage.notFound('Election') })

        const strippedElection = strip(electionDTO, ['id', 'createdAt', 'updatedAt'])
        if (strippedElection?.password) await this.hashEntityPassword(strippedElection)
        const updatedElection = this.manager.create(strippedElection!)
        updatedElection.id = existingElection.id

        this.serializeDates(updatedElection)

        this.electionIsChangingToStarted(existingElection, updatedElection)
        this.checkAndSetCloseDate(existingElection, updatedElection)

        await validateEntity(updatedElection, { strictGroups: true })

        return await this.manager.save(updatedElection)
    }

    /**
     * Serializes the dates, i.e. prepares it for insertion to the database
     * Since class-validator only compares dates when the both dates are a date object, the
     * dates need to be serialized beforehand.
     * @param election the election to serialize dates for
     */
    private serializeDates(election: Election) {
        if (election.openDate) {
            election.openDate = new Date(election.openDate)
        }

        if (election.closeDate) {
            election.closeDate = new Date(election.closeDate)
        }
    }

    /**
     * If election changing state from NotStarted to Started and sets the openDate to now
     * @param existingElection The election already persisted in the database
     * @param updatedElection The election with data to be updated
     */
    private electionIsChangingToStarted(existingElection: Election, updatedElection: Election) {
        if (
            existingElection.status === ElectionStatus.NotStarted &&
            updatedElection.status === ElectionStatus.Started
        ) {
            updatedElection.openDate = new Date()
        }
    }

    private checkAndSetCloseDate(existingElection: Election, updatedElection: Election) {
        if (
            (existingElection.status === ElectionStatus.Started ||
                existingElection.status === ElectionStatus.NotStarted) && // might be redundant
            updatedElection.status === ElectionStatus.Finished &&
            !updatedElection.closeDate
        ) {
            updatedElection.closeDate = new Date()
        }
    }

    private async deleteElectionById(id: number): Promise<void> {
        const election = await this.manager.findOne(id, { where: { electionOrganizer: this.owner } })
        if (!election) {
            throw new NotFoundError({ message: ServerErrorMessage.notFound('Election') })
        }

        if (election.status === ElectionStatus.Started) {
            throw new BadRequestError({ message: 'Cannot delete an election while its running' })
        }

        await this.manager.remove(election)
    }

    async isDuplicate(election: IElection): Promise<boolean> {
        const { title } = election
        const duplicate = await this.manager.find({
            where: {
                title,
                electionOrganizer: this.owner
            }
        })
        return duplicate.length > 0
    }

    private async hashEntityPassword(electionDTO: IElection) {
        const unhashedPassword = electionDTO.password
        const hashedPassword = await this.hashService.hash(unhashedPassword!)
        electionDTO.password = hashedPassword
    }

    /**
     * Returns true of the election is finished, else false
     */
    isFinished(election: IElection) {
        return election.status === ElectionStatus.Finished
    }

    verifyOwner(entity: Election): void {
        if (entity.electionOrganizer !== this.owner) {
            throw new ForbiddenError()
        }
    }

    /**
     * Marks an election closed.
     * Performs the necessary steps to satisfy the closed election criteria
     * @param entity the election entity to close
     */
    async markElectionClosed(entity: Election, forceClose: boolean) {
        if (forceClose) {
            entity.closeDate = new Date()
        }
        entity.status = ElectionStatus.Finished
        entity.isLocked = true

        return await this.repository.save(entity)
    }

    /**
     * Closes all elections in database that have an close date set, but where the status is not closed yet.
     * @returns the updated elections result
     */
    async closeAllElectionsWithCloseDateStarted() {
        return await this.repository
            .createQueryBuilder()
            .update(Election)
            .set({
                status: ElectionStatus.Finished,
                isLocked: true,
                closeDate: new Date()
            })
            .where('NOW() > closeDate')
            .andWhere('status = :status', { status: ElectionStatus.Started })
            .execute()
    }

    /**
     * Starts all elections in database that have an open date set, but where the status is set to started yet.
     * @returns the updated elections result
     */
    async startAllElectionsWhithOpenDateNotStarted() {
        return await this.repository
            .createQueryBuilder()
            .update(Election)
            .set({
                openDate: new Date(),
                isLocked: false,
                status: ElectionStatus.Started
            })
            .where('NOW() > openDate')
            .andWhere('status = :status', { status: ElectionStatus.NotStarted })
            .execute()
    }
}
