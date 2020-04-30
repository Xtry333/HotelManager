import { BaseModel } from './Base';
import { DataType, Model, Column, Table } from 'sequelize-typescript';
import { Reservation } from './ReservationDBO';

@Table({})
export class Room extends BaseModel<Room> {
    @Column
    public number: number

    @Column
    public label: string
}
