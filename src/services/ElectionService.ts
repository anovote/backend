import { Election } from '@/models/Election/ElectionEntity'
import { Connection, Repository } from 'typeorm'
import { IElection } from '@/models/Election/IElection'
import { EncryptionService } from './EncryptionService'
import { BadRequestError } from '@/lib/errors/http/BadRequestError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { validateEntity } from '@/helpers/validateEntity'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { strip } from '@/helpers/sanitize'
import BaseEntityService from './BaseEntityService'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { IHasOwner } from '@/interfaces/IHasOwner'
import { ForbiddenError } from '@/lib/errors/http/ForbiddenError'
import { SocketRoomEntity } from '@/models/SocketRoom/SocketRoomEntity'

export interface ElectionBody {
    title: string
    description: string
}

/**
 * Responsible for handling elections
 */
export class ElectionService extends BaseEntityService<Election> implements IHasOwner<Election> {
    private manager: Repository<Election>
    private readonly encryptionService: EncryptionService
    owner: ElectionOrganizer

    constructor(db: Connection, owner: ElectionOrganizer) {
        super(db, Election)
        this.owner = owner
        this.manager = db.getRepository(Election)
        this.encryptionService = new EncryptionService()
    }

    async getById(id: number): Promise<Election | undefined> {
        return await this.getElectionById(id)
    }

    async create(dto: IElection): Promise<Election | undefined> {
        return await this.createElection(dto)
    }
    async update(id: number, dto: Election): Promise<Election | undefined> {
        return await this.updateElectionById(id, dto)
    }
    async delete(id: number): Promise<void> {
        return await this.deleteElectionById(id)
    }

    async get(): Promise<Election[] | undefined> {
        try {
            const allElections = await this.getAllElections()
            return allElections
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
        return await this.manager.findOne(id, {
            relations: ['electionOrganizer'],
            where: {
                electionOrganizer: this.owner
            }
        })
    }

    async createElection(electionDTO: IElection): Promise<Election | undefined> {
        if (electionDTO.password) {
            await this.hashEntityPassword(electionDTO)
        }

        if (await this.isDuplicate(electionDTO)) {
            throw new BadRequestError({ message: 'Election already exists' })
        }

        const election = this.manager.create(electionDTO)
        await validateEntity(election, { groups: ['creation'] })
        election.id = -1

        election.socketRoom = new SocketRoomEntity()

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
        const hashedPassword = await this.encryptionService.hash(unhashedPassword!)
        electionDTO.password = hashedPassword
    }

    verifyOwner(entity: Election): void {
        if (entity.electionOrganizer !== this.owner) {
            throw new ForbiddenError()
        }
    }
}
