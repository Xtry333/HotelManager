import * as Db from '../js/query';
import * as GuestController from './GuestController';
import * as RoomController from './RoomController';
import randomstring from 'randomstring';
import { Reservation, ResSummaryView } from '../dtos/Reservation.dto';
import { ResourceError } from '../dtos/Error';
import { Guest } from '../dtos/Guest.dto';
import moment from 'moment';

export async function getAll() {
    const rows = await Db.querySelectAll(ResSummaryView);
    if (rows.length > -1) {
        return rows;
    } else {
        throw new ResourceError('Could not get Reservations listing.', rows, 500);
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

export async function getSummaryById(id: number) {
    const rows = await Db.querySelectAll(ResSummaryView, { resID: id });
    if (rows.length < 1) {
        throw new ResourceError(`Reservation Summary ID ${id} not found.`, rows, 404);
    } else if (rows.length === 1) {
        return rows[0];
    } else if (rows.length > 1) {
        throw new ResourceError(`Found more rows with one id.`, rows, 500);
    }
    throw new ResourceError(`Reservation ID ${id} does not exist.`, rows, 404);
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

    if (guest) {
        //await Db.queryInsert(Guest, {...guest});
        const created = await GuestController.create(guest);
        reservation.guest = created.id;
    } else {
        if (reservation.guest) {
            //const guestID = await GuestController.getById(reservation.guest);
        } else {
            throw new ResourceError('Guest not specified.', reservation, 400);
        }
    }

    if (reservation.room) {
        //const roomID = await RoomController.getById(reservation.room);
    } else {
        throw new ResourceError('Either reservation is missing key ids or something went wrong', reservation, 400);
    }

    const resId = await Db.queryInsert(Reservation, { ...reservation });
    //await Db.query('INSERT INTO `reservation` (`room`, `guest`, `numberOfPeople`, `pricePerDay`, `start`, `end`, `token`) VALUES (?, ?, ?, ?, ?, ?, ?)',
    //    [reservation.room.id, guest.id, reservation.numberOfPeople, reservation.pricePerDay, reservation.dateStart, reservation.dateEnd, token]);

    reservation.id = resId;

    return reservation;
}

export async function change(id: number, reservation: Reservation) {
    if (id && reservation) {
        const dateFormat = 'YYYY-MM-DD';
        const newObj: any = {};
        newObj.pricePerDay = reservation.pricePerDay;
        newObj.start = moment(reservation.start).format(dateFormat);
        newObj.end = moment(reservation.end).format(dateFormat);
        newObj.additionalResInfo = reservation.additionalResInfo || '';
        Db.queryUpdate(Reservation, newObj, { id: id });
    } else {
        throw new ResourceError('Either reservation is missing key ids or something went wrong', reservation, 400);
    }
}

export async function deleteById(id: number) {
    const reservation = await getById(id);
    if (reservation) {
        if (!reservation.deleted) {
            await Db.query('UPDATE `reservation` SET `deleted` = 1 WHERE `id` = ?', [id]);
            return reservation;
        }
    }
    throw new ResourceError(`Reservation ID ${id} does not exist.`, reservation, 404);
}