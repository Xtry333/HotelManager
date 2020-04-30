import { DataType, Model, Column, HasMany, Table, HasOne, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from './Base';
import { Reservation } from './ReservationDBO';
import { Address } from './AddressDBO';

@Table({})
export class Guest extends BaseModel<Guest> {
    @Column
    public email: string

    @Column
    public firstname: string

    @Column
    public lastname: string

    @Column
    @ForeignKey(() => Address)
    public addressId: number
    @BelongsTo(() => Address)
    public address: Address;

    @HasMany(() => Reservation)
    public reservations: Reservation[];
}

