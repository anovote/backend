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

    @Column('enum', { default: SocketRoomState.OPEN, enum: SocketRoomState })
    roomState!: SocketRoomState

    @OneToOne(() => Election, (election) => election.socketRoom, { cascade: ['insert', 'update'] })
    election!: Election
}
