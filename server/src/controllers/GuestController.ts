import * as Db from '../common/query';
import { Guest as GuestDto } from '../dtos/Guest.dto';
import { ResourceError } from '../dtos/Error';

export async function getAll () {
    return await Db.querySelectAll(GuestDto);
}

export async function getById (id: number): Promise<GuestDto | undefined> {
    const rows = await Db.querySelectAll(GuestDto, { id });
    if (rows.length < 1) {
        throw new ResourceError(`Guest ID ${id} not found`, rows);
    } else if (rows.length === 1) {
        return { ...rows[0] };
    } else if (rows.length > 1) {
        throw new ResourceError('Found more rows with one id.', rows);
    }
}

export async function create (guest: GuestDto) {
    console.log(guest);
    if (guest && guest.firstname && guest.lastname && guest.phoneNumber && guest.email) {
        // TODO: validate(guest.email, Email);

        const newObj: any = {};
        newObj.firstname = guest.firstname;
        newObj.lastname = guest.lastname;
        newObj.phoneNumber = guest.phoneNumber;
        newObj.email = guest.email;
        newObj.city = guest.city;
        newObj.streetName = guest.streetName;
        newObj.pesel = guest.pesel;

        const guestId = await Db.queryInsert(GuestDto, newObj);
        guest.id = guestId;
        return guest;
    } else {
        throw new ResourceError('Could not create guest. Check syntax.', guest, 400);
    }
}

export async function updateById (id: number, guest: GuestDto) {
    if (id && guest) {
        const newObj: any = {};
        newObj.firstname = guest.firstname;
        newObj.lastname = guest.lastname;
        newObj.phoneNumber = guest.phoneNumber;
        newObj.email = guest.email;
        newObj.city = guest.city;
        newObj.streetName = guest.streetName;
        newObj.pesel = guest.pesel;
        newObj.additionalGuestInfo = guest.additionalGuestInfo;

        Db.queryUpdate(GuestDto, newObj, { id: id });
    } else {
        throw new ResourceError('Either reservation is missing key fields or something went wrong', guest, 400);
    }
}

export async function deleteById (id: number) {
    if (id) {
        await Db.query('DELETE FROM `guest` WHERE `id` = ?', [id]);
        return true;
    } else {
        throw new ResourceError(`Reservation ID ${id} does not exist.`, undefined, 404);
    }
}
