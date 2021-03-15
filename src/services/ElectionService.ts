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
import { Connection, Repository } from 'typeorm'
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
    private _db: Connection
    constructor(db: Connection, owner?: ElectionOrganizer) {
        super(db, Election)
        this._db = db
        this.owner = owner
        this.manager = db.getRepository(Election)
        this.hashService = new HashService()
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

    private async getElectionById(id: number): Promise<Election | undefined> {
        if (this.owner) {
            return await this.manager.findOne(id, {
                relations: ['electionOrganizer'],
                where: {
                    electionOrganizer: this.owner
                }
            })
        }

        return await this.manager.findOne(id)
    }

    async createElection(electionDTO: IElection): Promise<Election | undefined> {
        const eligibleVoterService = new EligibleVoterService(this._db)

        if (electionDTO.eligibleVoters) {
            electionDTO.eligibleVoters = eligibleVoterService.correctListOfEligibleVoters(electionDTO.eligibleVoters)
        }

        if (electionDTO.password) {
            await this.hashEntityPassword(electionDTO)
        }

        if (await this.isDuplicate(electionDTO)) {
            throw new BadRequestError({ message: 'Election already exists' })
        }

        const election = this.manager.create(electionDTO)

        // the mapping from json to election does not transform the date string into date type. Have to do it manually
        if (election.closeDate) {
            election.closeDate = new Date(election.closeDate!)
        }
        if (election.openDate) {
            election.openDate = new Date(election.openDate!)
        }

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
        await validateEntity(updatedElection, { strictGroups: true })

        return await this.manager.save(updatedElection)
    }

    async deleteElectionById(id: number): Promise<void> {
        const election = await this.manager.findOne(id, { where: { electionOrganizer: this.owner } })
        if (!election) {
            throw new NotFoundError({ message: ServerErrorMessage.notFound('Election') })
        }
        await this.manager.remove(election)
    }

    async isDuplicate(election: IElection): Promise<boolean> {
        const { title, description, image, openDate, closeDate, status, isLocked, isAutomatic } = election
        const duplicate = await this.manager.find({
            where: {
                title,
                description,
                image,
                openDate,
                closeDate,
                status,
                isLocked,
                isAutomatic
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
}
