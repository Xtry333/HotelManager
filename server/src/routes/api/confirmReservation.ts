// import express from 'express';
// const router = express.Router();
// import mysql from '../../common/sql';
// import moment from 'moment';

// router.get('/((:json/)?:id/:token)', function (req, res, next) {
//     const id = req.params.id;
//     const token = req.params.token;
//     const json = req.params.json == 'json';
//     const confirmation = { id, token };
//     mysql.query('SELECT * FROM `ressummary` WHERE `resToken` = ? AND `resID` = ?', [token, id], (err, row, field) => {
//         if (err) throw err;
//         if (row.length == 0) {
//             res.status(404).json({ error: { message: "No such reservation." } });
//         } else {
//             const reservation = row[0];
//             if (reservation.depoAdded) {
//                 confirmation.depoAddedString = moment(reservation.depoAdded).format('DD.MM.YYYY HH:MM:SS');
//                 confirmation.depoAdded = reservation.depoAdded;
//             }
//             confirmation.resStartString = moment(reservation.resStart).format('DD.MM.YYYY [14:00:00]');
//             confirmation.resStart = reservation.resStart;
//             confirmation.resEndString = moment(reservation.resEnd).format('DD.MM.YYYY [10:00:00]');
//             confirmation.resEnd = reservation.resEnd;
//             confirmation.pricePerDay = reservation.pricePerDay;
//             confirmation.totalDays = Math.ceil((reservation.resEnd.getTime() - reservation.resStart.getTime()) / (1000 * 60 * 60 * 24));
//             confirmation.totalPrice = confirmation.totalDays * confirmation.pricePerDay;
//             mysql.query('SELECT * FROM `roomview` WHERE `roomID` = ?', [reservation.roomID], (err, row, field) => {
//                 const room = row[0];
//                 confirmation.roomID = reservation.roomID;
//                 confirmation.guestFirstname = reservation.guestFirstname;
//                 confirmation.guestLastname = reservation.guestLastname;
//                 confirmation.guestPhoneNumber = reservation.guestPhoneNumber;
//                 confirmation.roomNumber = room.roomNumber;
//                 confirmation.floorCaption = room.floorCaption;

//                 if (json) {
//                     res.json(confirmation);
//                 } else {
//                     res.render('resconfirmation', confirmation);
//                 }
//             })
//         }
//     });
//     //mysql.release();
// });

// export default router;