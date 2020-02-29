import { Room, RoomImagesLink, RoomView } from '../dtos/Room.dto';
import { ResourceError } from '../dtos/Error';
import moment from 'moment';

import * as Db from '../common/query';

const dateFormat = 'YYYY-MM-DD';

export async function getAll () {
    const rows = await Db.querySelectAll(RoomView);
    if (rows.length > -1) {
        return rows;
    } else {
        throw new ResourceError('Could not get Rooms listing.', rows, 500);
    }
}

export async function getById (id: number) {
    const rows = await Db.querySelectAll(RoomView, { roomID: id });
    if (rows.length < 1) {
        throw new ResourceError(`Room ID ${id} not found.`, rows, 404);
    } else if (rows.length === 1) {
        const room = rows[0];
        const images = await getImagesForRoomId(id);
        room.images = images;
        return room;
    } else if (rows.length > 1) {
        throw new ResourceError('Found more rows with one id.', rows, 500);
    }
    throw new ResourceError(`Room ID ${id} does not exist.`, rows, 404);
}

export async function create (room: Room): Promise<RoomView> {
    // await query('INSERT INTO `guest` (`firstname`, `lastname`, `phoneNumber`) VALUES (?, ?, ?)', [guest.firstname, guest.lastname, guest.phoneNumber]);
    // const id = await sql.getLastInsertedId();
    throw new ResourceError('Room creation not implemented yet.');
}

export async function updateById (room: Room): Promise<RoomView> {
    // await query('INSERT INTO `guest` (`firstname`, `lastname`, `phoneNumber`) VALUES (?, ?, ?)', [guest.firstname, guest.lastname, guest.phoneNumber]);
    // const id = await sql.getLastInsertedId();
    throw new ResourceError('Room updating not implemented yet.');
}

export async function getImagesForRoomId (id: number): Promise<RoomImagesLink[]> {
    const results = await Db.querySelectAll(RoomImagesLink, { room: id });
    if (results.length > -1) {
        return results;
    } else {
        throw new ResourceError(`Error when getting images for Room ID ${id}.`, results, 500);
    }
}

export async function getFree (start: string, end: string): Promise<RoomView[]> {
    if (start && end) {
        const startDate = moment(start).format(dateFormat);
        const endDate = moment(end).format(dateFormat);
        const results = await Db.query(
            'SELECT * FROM `roomView` LEFT JOIN (SELECT room, start, end FROM `reservation` AS `res` WHERE (res.start > ? AND res.end < ?) OR (res.start <= ? AND res.end > ?) OR (res.end >= ? AND res.start < ?)) AS `res` ON roomID = res.room WHERE room IS NULL;',
            [startDate, endDate, startDate, startDate, endDate, endDate]
        );
        return results as RoomView[];
    } else {
        return [];
    }
}
