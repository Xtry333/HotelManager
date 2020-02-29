import moment from 'moment';
import Express from 'express';
import randomstring from 'randomstring';
import * as Db from '../common/query';
import { User, Token } from '../dtos/User.dto';
import { RowDataPacket } from 'mysql2';
import { ResourceError } from '../dtos/Error';
import { getSetting, setSetting } from './SettingController';

export let loginExpiration: number;
// setSetting('login-expiration', 60 * 60 * 24 * 1);

export const authUser = async (login: { username: string, passwordHash: string, userAgent: string }) => {
    const result = await Db.querySelectAll(User, { username: login.username, password: login.passwordHash });
    // const response = await query('SELECT `id`, `firstname`, `lastname`, `username` FROM `user` WHERE `username` = ? AND `password` = ?',
    //    [login.username, login.password]);
    if (result.length == 1) {
        const user = result[0];
        const token = randomstring.generate(64);
        const userAgent = login.userAgent;
        await Db.queryInsert(Token, { user: user.id, token, userAgent });
        // await query('INSERT INTO `token` (`token`, `user`, `userAgent`) VALUES (?, ?, ?)', [token, user.id, userAgent]);
        cleanTokens();
        delete user.password;
        return { user, token };
    }
    throw new ResourceError('Invalid credentials.', undefined, 406);
};

export const validateToken = async (token: string) => {
    if (!loginExpiration) {
        loginExpiration = parseInt((await getSetting('login-expiration')).value);
    }
    if (token && token.length > 0) {
        const response = await Db.query('SELECT * FROM `token` WHERE `token` = ? AND DATE_ADD(`accessed`, INTERVAL ? SECOND) > NOW()',
            [token, loginExpiration]);
        const rows = response as RowDataPacket[];
        if (rows.length == 1) {
            Db.query('UPDATE `token` SET `accessed` = ? WHERE `token` = ? AND DATE_ADD(`accessed`, INTERVAL ? SECOND) > NOW()',
                [moment().format('YYYY-MM-DD HH:mm:ss'), token, loginExpiration]);
            return true;
        }
    } else {
        throw new ResourceError('Token must be a string.', token, 400);
    }
    return false;
};

export const isAuthorized = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    try {
        cleanTokens();
        const token: string = req.get('Auth-Token') || '';
        const validated = await validateToken(token);
        if (validated) {
            return next();
        } else {
            res.status(401).json({ error: { message: 'Invalid token.' } });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const cleanTokens = async () => {
    if (!loginExpiration) {
        loginExpiration = parseInt((await getSetting('login-expiration')).value);
    }
    await Db.query('DELETE FROM `token` WHERE DATE_ADD(`accessed`, INTERVAL ? SECOND) < NOW()', [loginExpiration]);
};
