import * as Db from '../common/query';
import * as GuestController from './GuestController';
import * as RoomController from './RoomController';
import randomstring from 'randomstring';
import { ResourceError } from '../dtos/Error';
import { Guest } from '../dtos/Guest.dto';
import moment from 'moment';
import { Room, RoomView } from '../dtos/Room.dto';
import { Request, Response, NextFunction } from "express";
import { Reservation } from 'models/ReservationDBO';
import { IncludeAll } from 'models/Base';
import { GenericController } from './GenericController'

class ReservationController extends GenericController<Reservation> {

}

export default new ReservationController(Reservation);

// export async function getAll(vars?: { [key: string]: string | number }) {
//     const args: { [key: string]: string | number } = {};
//     for (const key in vars) {
//         if (vars[key]) {
//             args[key] = vars[key];
//         }
//     }
//     const rows = await Db.querySelectAll(Reservation, args);
//     if (rows.length > -1) {
//         return rows;
//     } else {
//         throw new ResourceError('Could not get Reservation listing.', rows, 500);
//     }
// }

// export async function getById(id: number) {
//     const rows = await Db.querySelectAll(Reservation, { id });
//     if (rows.length < 1) {
//         throw new ResourceError(`Reservation ID ${id} not found.`, rows, 404);
//     } else if (rows.length === 1) {
//         return rows[0];
//     } else if (rows.length > 1) {
//         throw new ResourceError('Found more rows with one id.', rows, 500);
//     }
// }

// // export async function getAllResSummaryView() {
// //     const rows = await Db.querySelectAll(ResSummaryView);
// //     if (rows.length > -1) {
// //         return rows;
// //     } else {
// //         throw new ResourceError('Could not get ResSummaryView listing.', rows, 500);
// //     }
// // }

// export async function getAllResSummaryView(vars?: { [key: string]: string | number }) {
//     const args: { [key: string]: string | number } = {};
//     for (const key in vars) {
//         if (vars[key]) {
//             args[key] = vars[key];
//         }
//     }
//     const rows = await Db.querySelectAll(ResSummaryView, args);
//     if (rows.length > -1) {
//         return rows;
//     } else {
//         throw new ResourceError('Could not get ResSummaryView listing.', rows, 500);
//     }
// }

// export async function getSummaryById(id: number) {
//     const rows = await Db.querySelectAll(ResSummaryView, { resID: id });
//     if (rows.length < 1) {
//         throw new ResourceError(`Reservation Summary ID ${id} not found.`, rows, 404);
//     } else if (rows.length === 1) {
//         return rows[0];
//     } else if (rows.length > 1) {
//         throw new ResourceError('Found more rows with one id.', rows, 500);
//     }
//     throw new ResourceError(`Reservation Summary ID ${id} does not exist.`, rows, 404);
// }

// export async function getSummaryByToken(token: string) {
//     const rows = await Db.querySelectAll(ResSummaryView, { resToken: token });
//     if (rows.length < 1) {
//         throw new ResourceError(`Reservation Summary with Token ${token} not found.`, rows, 404);
//     } else if (rows.length === 1) {
//         return rows[0];
//     } else if (rows.length > 1) {
//         throw new ResourceError('Found more rows with one id.', rows, 500);
//     }
//     throw new ResourceError(`Reservation Summary with Token ${token} does not exist.`, rows, 404);
// }

// export async function create(reservation: Reservation, guest?: Guest) {
//     const errorFields: string[] = [];
//     // TODO: Check if reservations overlap with any other, if so, deny
//     // For reservations not to overlap there must be, not same room or
//     // This ones start date must be earlier than start of another one or later than end of another one
//     // This ones end date must be earlier than next ones start date
//     // Also start mst be earlier than end
//     const token = randomstring.generate(32);

//     if (!reservation) throw new ResourceError('Reservation not specified.', undefined, 400);
//     reservation.token = token;

//     if (!reservation.guest) {
//         if (guest) {
//             const created = await GuestController.create(guest);
//             reservation.guest = created.id;
//         } else {
//             throw new ResourceError('Reservation is missing guest ID and new guest not been specified.', reservation, 400);
//         }
//     }

//     if (reservation.start >= reservation.end) {
//         throw new ResourceError('Reservation cannot end earlier than it starts!', reservation, 400);
//     }

//     const freeRooms = await RoomController.getFree(reservation.start as any, reservation.end as any);
//     if (!freeRooms.find(room => room.roomID == reservation.room)) {
//         throw new ResourceError('Reservation cannot overlap with any other!', reservation, 400);
//     }

//     if (reservation.room) {
//         // const roomID = await RoomController.getById(reservation.room);
//     } else {
//         throw new ResourceError('Reservation is missing room ID.', reservation, 400);
//     }

//     const newObj: any = {};
//     newObj.token = reservation.token;
//     newObj.guest = reservation.guest;
//     newObj.room = reservation.room;
//     newObj.pricePerDay = reservation.pricePerDay;
//     newObj.start = moment(reservation.start).format(Db.dateFormat);
//     newObj.end = moment(reservation.end).format(Db.dateFormat);
//     newObj.numberOfPeople = reservation.numberOfPeople;
//     newObj.additionalResInfo = reservation.additionalResInfo || '';

//     const resId = await Db.queryInsert(Reservation, { ...newObj });
//     // await Db.query('INSERT INTO `reservation` (`room`, `guest`, `numberOfPeople`, `pricePerDay`, `start`, `end`, `token`) VALUES (?, ?, ?, ?, ?, ?, ?)',
//     //    [reservation.room.id, guest.id, reservation.numberOfPeople, reservation.pricePerDay, reservation.dateStart, reservation.dateEnd, token]);

//     reservation.id = resId;

//     return reservation;
// }

// export async function updateById(id: number, reservation: Reservation) {
//     if (id && reservation) {
//         const newObj: any = {};
//         newObj.pricePerDay = reservation.pricePerDay;
//         newObj.start = moment(reservation.start).format(Db.dateFormat);
//         newObj.end = moment(reservation.end).format(Db.dateFormat);
//         newObj.numberOfPeople = reservation.numberOfPeople;
//         newObj.additionalResInfo = reservation.additionalResInfo || '';
//         newObj.room = reservation.room;
//         if (reservation.start >= reservation.end) {
//             throw new ResourceError('Reservation cannot end earlier than it starts!', reservation, 400);
//         }
//         // TODO: Check if reservations overlap with any other, if so, deny
//         Db.queryUpdate(Reservation, newObj, { id: id });
//     } else {
//         throw new ResourceError('Either reservation is missing key fields or something went wrong', reservation, 400);
//     }
// }

// export async function deleteById(id: number): Promise<boolean> {
//     if (id) {
//         await Db.query('DELETE FROM `reservation` WHERE `id` = ?', [id]);
//         // const reservation = await getById(id);
//         // if (reservation) {
//         //     if (!reservation.deleted) {
//         // await Db.query('UPDATE `reservation` SET `deleted` = 1 WHERE `id` = ?', [id]);
//         //         return reservation;
//         //     }
//         // }
//         return true;
//     } else {
//         throw new ResourceError(`Reservation ID ${id} does not exist.`, undefined, 404);
//     }
// }

// export async function getCurrentForDate(date?: string): Promise<Reservation[]> {
//     if (!date) {
//         date = moment().format(Db.dateFormat);
//     }
//     const activeRes = await Db.query('SELECT * FROM `reservation` WHERE `deleted` = 0 AND ? BETWEEN `start` AND `end`', [date]);
//     return activeRes as Reservation[];
// }
