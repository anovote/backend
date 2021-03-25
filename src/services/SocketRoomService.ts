import { BallotVoteStats } from '@/lib/voting/BallotStats'
import { AnoSocket, OrganizerSocket, VoterSocket } from '@/lib/websocket/AnoSocket'
import { database } from '@/loaders'
import { logger } from '@/loaders/logger'
import { SocketRoomEntity, SocketRoomState } from '@/models/SocketRoom/SocketRoomEntity'
import chalk from 'chalk'
import { Server } from 'socket.io'
import { Connection, getConnection } from 'typeorm'
import BaseEntityService, { CrudOptions } from './BaseEntityService'
import { ElectionService } from './ElectionService'

export class SocketRoomService extends BaseEntityService<SocketRoomEntity> {
    // electionId: number
    private static instance: SocketRoomService

    /**
     * Contains a list of all election rooms with their organizer socket ID.
     * An election room can exist without an organizer socket.
     */
    private _electionRooms: Map<
        number,
        {
            // the socket id of the organizer of the election, is undefined if the organizer is not connected
            organizerSocketId: string | undefined
            // Contains ballot vote stats for all ballots for the election, the key is Ballot id
            ballotVoteStats: Map<number, BallotVoteStats>
        }
    > = new Map()
    private constructor(databaseConnection: Connection) {
        super(databaseConnection, SocketRoomEntity)
        // this.electionId = electionId
    }

    /**
     * Loads all non-started and started elections to generate all rooms
     */
    async loadElections() {
        // TODO: Load all votes for each ballots to get proper stats for the ballots
        const electionService = new ElectionService(database)
        const elections = await electionService.getAllStartedAndNonStarted()
        for (const election of elections) {
            const ballotMap = new Map()

            for (const ballot of election.ballots) {
                ballotMap.set(ballot.id, new BallotVoteStats(ballot))
            }
            this._electionRooms.set(election.id, {
                organizerSocketId: undefined,
                ballotVoteStats: ballotMap
            })
        }
    }

    static getInstance(): SocketRoomService {
        if (!SocketRoomService.instance) {
            // todo connection should be fetched based on environment. connection should be set to default if environnement is dev or production
            SocketRoomService.instance = new SocketRoomService(getConnection())
        }

        return this.instance
    }

    get(): Promise<SocketRoomEntity[] | undefined> {
        throw new Error('Method not implemented.')
    }

    /**
     * Gets the socket room by the election id
     * @param electionId the ID of the election which the room belongs to
     * @returns a socket room entity or undefined
     */
    async getById(electionId: number): Promise<SocketRoomEntity | undefined> {
        return await this.repository
            .createQueryBuilder('socket_room_entity')
            .leftJoinAndSelect('socket_room_entity.election', 'election')
            .where('election."id" = :value', { value: electionId })
            .getOne()
    }

    create(dto: SocketRoomEntity, options?: CrudOptions): Promise<SocketRoomEntity | undefined> {
        throw new Error('Method not implemented.')
    }

    update(id: number, dto: SocketRoomEntity): Promise<SocketRoomEntity | undefined> {
        throw new Error('Method not implemented.')
    }

    delete(id: number): Promise<void> {
        throw new Error('Method not implemented.')
    }

    createRoom(electionId: number) {
        const room = this._electionRooms.get(electionId)
        if (!room) {
            this._electionRooms.set(electionId, {
                organizerSocketId: undefined,
                ballotVoteStats: new Map()
            })
        }
    }

    deleteRoom(electionId: number) {
        this._electionRooms.delete(electionId)
    }
    /**
     * Assigns an organizer socket to a room, and set it as owner of the room
     * @param organizerSocket an organizer that we want to assign as owner of the room
     */
    setElectionRoomOrganizer(electionId: number, organizerSocket: OrganizerSocket) {
        const room = this._electionRooms.get(electionId)
        if (room) room.organizerSocketId = organizerSocket.id
    }

    /**
     * Assigns an organizer socket to a room, and set it as owner of the room
     * @param organizerSocket an organizer that we want to assign as owner of the room
     */
    removeElectionRoomOrganizer(electionId: number) {
        this._electionRooms.delete(electionId)
    }

    getRoom(electionId: number) {
        return this._electionRooms.get(electionId)
    }

    /**
     * Returns the election organizer socket id for the provided election.
     * @param electionId the election id to get organizer socket from
     * @returns returns the socket ID or undefined if organizer is not connected
     */
    getOrganizerSocketIdForElection(electionId: number) {
        return this._electionRooms.get(electionId)?.organizerSocketId
    }

    /**
     * Adds user to room if there is a socket room open for this client. Else does nothing
     * @param clientSocket The client socket connection
     * @param socketServer The socket server
     */
    async addUserToRoom(clientSocket: VoterSocket, socketServer: Server) {
        const socketId = chalk.blue(clientSocket.id)
        if (!clientSocket.electionId) {
            logger.info(
                `tried to connect to room ${clientSocket.electionId}. This room is either closed or does not exist`
            )
            return
        }
        const room = await this.getById(clientSocket.electionId!)
        const openRoom = room?.roomState === SocketRoomState.OPEN
        if (!openRoom) {
            logger.info(
                `tried to connect to room ${clientSocket.electionId}. This room is either closed or does not exist`
            )
            return
        }

        const electionIdString = clientSocket.electionId!.toString()
        logger.info(`${socketId} was added to election room ${electionIdString}`)
        await clientSocket.join(electionIdString)
        socketServer.to(electionIdString).send(`You have joined election room: ${electionIdString}`)
    }
}
