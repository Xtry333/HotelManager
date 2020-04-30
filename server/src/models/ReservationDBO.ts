import { DataType, Association, Model, Column, HasOne, Table, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { BaseModel } from './Base';
import { Guest } from './GuestDBO';
import { Room } from './RoomDBO';
import { User } from './UserDBO';
import { Payment } from './PaymentDBO';

@Table({})
export class Reservation extends BaseModel<Reservation> {
    @Column
    @ForeignKey(() => Guest)
    public guestId: number
    @BelongsTo(() => Guest)
    public guest: Guest;

    @Column
    @ForeignKey(() => Room)
    public roomId: number
    @BelongsTo(() => Room)
    public room: Room;

    @Column
    @ForeignKey(() => User)
    public creatorId: number
    @BelongsTo(() => User)
    public creator: User;
    
    @Column
    public checkIn: Date

    @Column
    public checkOut: Date

    @HasMany(() => Payment)
    public payments: Payment[]

}
