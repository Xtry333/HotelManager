import { DataType, Association, Model, Column, HasOne, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from './Base';
import { Room } from './RoomDBO';
import { Reservation } from './ReservationDBO';

@Table({})
export class Payment extends BaseModel<Payment> {
    @Column(DataType.ENUM('deposit', 'payment'))
    public type: string
    
    @Column
    @ForeignKey(() => Reservation)
    public reservationId: number
    @BelongsTo(() => Reservation)
    public reservation: Room;
}
