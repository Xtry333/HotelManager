import * as Db from '../js/query';
import { User as UserDto } from '../dtos/User.dto';
import { ResourceError } from '../dtos/Error';

export async function getAll() {
    return await Db.querySelectAll(UserDto);
}

export async function getById(id: number): Promise<UserDto | undefined> {
    const rows = await Db.querySelectAll(UserDto, { id });
    if (rows.length < 1) {
        throw new ResourceError(`User ID ${id} not found`, rows);
    } else if (rows.length === 1) {
        return { ...rows[0] };
    } else if (rows.length > 1) {
        throw new ResourceError(`Found more rows with one id.`, rows);
    }
}

export async function create(user: UserDto) {
    console.log(user);
    if (user && user.username && user.firstname && user.email && user.password) {
        // TODO: validate(guest.email, Email);

        const newObj: any = {};
        newObj.username = user.username;
        newObj.firstname = user.firstname;
        newObj.lastname = user.lastname;
        newObj.email = user.email;
        newObj.password = user.password;

        const userId = await Db.queryInsert(UserDto, newObj);
        user.id = userId;
        return user;
    } else {
        const errorFields = [];
        if (user) {
            if (!user.username) errorFields.push('username');
            if (!user.password) errorFields.push('password');
            if (!user.firstname) errorFields.push('firstname');
            if (!user.email) errorFields.push('email');
        }
        throw new ResourceError('Could not create user. Check syntax.', errorFields, 400);
    }
}

export async function updateById(id: number, user: UserDto) {
    if (id && user) {
        const newObj: any = {};
        newObj.firstname = user.firstname;
        newObj.lastname = user.lastname;
        newObj.username = user.username;
        newObj.email = user.email;
        newObj.additionalInfo = user.additionalInfo;
        if (user.password) newObj.password = user.password;
        
        Db.queryUpdate(UserDto, newObj, { id: id });
    } else {
        const errorFields = [];
        if (user) {
            if (!user.username) errorFields.push('username');
            if (!user.password) errorFields.push('password');
            if (!user.firstname) errorFields.push('firstname');
        }
        throw new ResourceError('Either user is missing key fields or something went wrong', user, 400);
    }
}

export async function deleteById(id: number) {
    if (id) {
        await Db.query('DELETE FROM `user` WHERE `id` = ?', [id]);
        return true;
    } else {
        throw new ResourceError(`User ID ${id} does not exist.`, undefined, 404);
    }
}