import * as Db from '../js/query';
import { Guest } from '../dtos/Guest.dto';
import { ResourceError } from '../dtos/Error';

export async function getAll() {
    return await Db.querySelectAll(Guest);
}

export async function getById(id: number): Promise<Guest | undefined> {
    const rows = await Db.querySelectAll(Guest, { id });
    if (rows.length < 1) {
        throw new ResourceError(`Guest ID ${id} not found`, rows);
    } else if (rows.length === 1) {
        return { ...rows[0] };
    } else if (rows.length > 1) {
        throw new ResourceError(`Found more rows with one id.`, rows);
    }
}

export async function create(guest: Guest) {
    if (guest && guest.firstname && guest.lastname && guest.phoneNumber && guest.email) {
        // TODO: validate(guest.email, Email);

        const newObj: any = {};
        newObj.firstname = guest.firstname;
        newObj.lastname = guest.lastname;
        newObj.phoneNumber = guest.phoneNumber;
        newObj.email = guest.email;
        newObj.city = guest.city;

        const guestId = await Db.queryInsert(Guest, newObj);
        //await db.query('INSERT INTO `guest` (`firstname`, `lastname`, `phoneNumber`, `email`) VALUES (?, ?, ?, ?)', [guest.firstname, guest.lastname, guest.phoneNumber, guest.email]);
        guest.id = guestId;
        return guest;
    } else {
        throw new ResourceError('Could not create guest. Check syntax.', guest, 400);
    }
}