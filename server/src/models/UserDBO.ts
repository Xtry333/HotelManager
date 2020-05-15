import { Column, Table } from 'sequelize-typescript';
import { BaseModel } from './Base';
import bcrypt from 'bcrypt';

@Table({})
export class User extends BaseModel<User> {

    @Column
    public email: string

    @Column
    public passwordHash: string;

    @Column
    public username: string

    @Column
    public firstname: string

    @Column
    public lastname: string
}

User.beforeCreate(async (user) => {
    try {
        user.passwordHash = await cryptPassword(user.passwordHash, 10);
    } catch (err) {
        if (err) {
            console.error(err);
        }
    }
});

function cryptPassword(password: string, saltPinches: number = 10): Promise<string> {
    return new Promise(function (resolve, reject) {
        bcrypt.genSalt(saltPinches, function (err, salt) {
            if (err) { return reject(err); }

            bcrypt.hash(password, salt, function (err, hash) {
                if (err) { return reject(err); }
                return resolve(hash);
            });
        });
    });
}