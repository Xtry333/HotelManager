import * as Db from '../js/query';
import * as GuestController from './GuestController';
import * as RoomController from './RoomController';
import randomstring from 'randomstring';
import { Reservation, ResSummaryView } from '../dtos/Reservation.dto';
import { ResourceError } from '../dtos/Error';
import { Guest } from '../dtos/Guest.dto';
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD hh:mm';

export async function getAll() {
    const rows = await Db.querySelectAll(Reservation);
    if (rows.length > -1) {
        return rows;
    } else {
        throw new ResourceError('Could not get Reservation listing.', rows, 500);
    }
}

export async function getAllWithArgs(vars: { [key: string]: string | number }) {
    const args: { [key: string]: string | number } = {};
    for (const key in vars) {
        if (vars[key]) {
            args[key] = vars[key];
        }
    }
    const rows = await Db.querySelectAll(Reservation, args);
    if (rows.length > -1) {
        return rows;
    } else {
        throw new ResourceError('Could not get Reservation listing.', rows, 500);
    }
}

export async function getById(id: number) {
    const rows = await Db.querySelectAll(Reservation, { id });
    if (rows.length < 1) {
        throw new ResourceError(`Reservation ID ${id} not found.`, rows, 404);
    } else if (rows.length === 1) {
        return rows[0];
    } else if (rows.length > 1) {
        throw new ResourceError(`Found more rows with one id.`, rows, 500);
    }
}

export async function getAllResSummaryView() {
    const rows = await Db.querySelectAll(ResSummaryView);
    if (rows.length > -1) {
        return rows;
    } else {
        throw new ResourceError('Could not get ResSummaryView listing.', rows, 500);
    }
}

export async function getAllResSummaryViewWithArgs(vars: { [key: string]: string | number }) {
    const args: { [key: string]: string | number } = {};
    for (const key in vars) {
        if (vars[key]) {
            args[key] = vars[key];
        }
    }
    const rows = await Db.querySelectAll(ResSummaryView, args);
    if (rows.length > -1) {
        return rows;
    } else {
        throw new ResourceError('Could not get ResSummaryView listing.', rows, 500);
    }
}

export async function getSummaryById(id: number) {
    const rows = await Db.querySelectAll(ResSummaryView, { resID: id });
    if (rows.length < 1) {
        throw new ResourceError(`Reservation Summary ID ${id} not found.`, rows, 404);
    } else if (rows.length === 1) {
        return rows[0];
    } else if (rows.length > 1) {
        throw new ResourceError(`Found more rows with one id.`, rows, 500);
    }
    throw new ResourceError(`Reservation Summary ID ${id} does not exist.`, rows, 404);
}

export async function getSummaryByToken(token: string) {
    const rows = await Db.querySelectAll(ResSummaryView, { resToken: token });
    if (rows.length < 1) {
        throw new ResourceError(`Reservation Summary with Token ${token} not found.`, rows, 404);
    } else if (rows.length === 1) {
        return rows[0];
    } else if (rows.length > 1) {
        throw new ResourceError(`Found more rows with one id.`, rows, 500);
    }
    throw new ResourceError(`Reservation Summary with Token ${token} does not exist.`, rows, 404);
}

export async function create(reservation: Reservation, guest?: Guest) {
    //TODO: Check if reservations overlap with any other, if so, deny
    // For reservations not to overlap there must be, not same room or
    // This ones start date must be earlier than start of another one or later than end of another one
    // This ones end date must be earlier than next ones start date
    // Also start mst be earlier than end
    const token = randomstring.generate(32);

    if (!reservation) throw new ResourceError('Reservation not specified.', undefined, 400);
    reservation.token = token;

    if (!reservation.guest) {
        if (guest) {
            const created = await GuestController.create(guest);
            reservation.guest = created.id;
        } else {
            throw new ResourceError('Reservation is missing guest ID and new guest not been specified.', reservation, 400);
        }
    }

    if (reservation.room) {
        //const roomID = await RoomController.getById(reservation.room);
    } else {
        throw new ResourceError('Reservation is missing room ID.', reservation, 400);
    }

    const newObj: any = {};
    newObj.token = reservation.token;
    newObj.guest = reservation.guest;
    newObj.room = reservation.room;
    newObj.pricePerDay = reservation.pricePerDay;
    newObj.start = moment(reservation.start).format(dateFormat);
    newObj.end = moment(reservation.end).format(dateFormat);
    newObj.numberOfPeople = reservation.numberOfPeople;
    newObj.additionalResInfo = reservation.additionalResInfo || '';

    const resId = await Db.queryInsert(Reservation, { ...newObj });
    //await Db.query('INSERT INTO `reservation` (`room`, `guest`, `numberOfPeople`, `pricePerDay`, `start`, `end`, `token`) VALUES (?, ?, ?, ?, ?, ?, ?)',
    //    [reservation.room.id, guest.id, reservation.numberOfPeople, reservation.pricePerDay, reservation.dateStart, reservation.dateEnd, token]);

    reservation.id = resId;

    return reservation;
}

export async function updateById(id: number, reservation: Reservation) {
    if (id && reservation) {
        const newObj: any = {};
        newObj.pricePerDay = reservation.pricePerDay;
        newObj.start = moment(reservation.start).format(dateFormat);
        newObj.end = moment(reservation.end).format(dateFormat);
        newObj.numberOfPeople = reservation.numberOfPeople;
        newObj.additionalResInfo = reservation.additionalResInfo || '';
        newObj.room = reservation.room;
        Db.queryUpdate(Reservation, newObj, { id: id });
    } else {
        throw new ResourceError('Either reservation is missing key fields or something went wrong', reservation, 400);
    }
}

export async function deleteById(id: number) {
    if (id) {
        await Db.query('DELETE FROM `reservation` WHERE `id` = ?', [id]);
        // const reservation = await getById(id);
        // if (reservation) {
        //     if (!reservation.deleted) {
        //await Db.query('UPDATE `reservation` SET `deleted` = 1 WHERE `id` = ?', [id]);
        //         return reservation;
        //     }
        // }
        return true;
    } else {
        throw new ResourceError(`Reservation ID ${id} does not exist.`, undefined, 404);
    }
}