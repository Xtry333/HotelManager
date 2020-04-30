import { DataType, Model, Column, Table } from 'sequelize-typescript';
import { BaseModel } from './Base';

@Table({})
export class User extends BaseModel<User> {

    @Column
    public email: string

    @Column
    public passwordHash: string

    @Column
    public username: string

    @Column
    public firstname: string

    @Column
    public lastname: string
}
