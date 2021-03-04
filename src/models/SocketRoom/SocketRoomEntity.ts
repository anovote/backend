import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Election } from '../Election/ElectionEntity'
export enum SocketRoomState {
    OPEN,
    CLOSE
}

@Entity()
export class SocketRoomEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: 'enum', default: SocketRoomState.OPEN })
    roomState!: SocketRoomState

    @OneToOne(() => Election, (election) => election.socketRoom)
    election!: Election
}
