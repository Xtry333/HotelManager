import { DataType, Association, Model, Column, HasOne, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from './Base';

@Table({})
export class Address extends BaseModel<Address> {
    @Column
    public streetName: string;

    @Column
    public streetNumber: string;

    @Column
    public postalCode: string;

    @Column
    public city: string;

    @Column
    public country: string;
}
