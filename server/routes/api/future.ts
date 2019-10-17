import Express from 'express';
import mysql from '../../js/sql';
import moment from 'moment';

const router = Express.Router();

router.get('/((:json/)?)', (req, res, next) => {
    res.redirect('/future/' + moment().add(1, 'day').format('YYYY-MM-DD'));
});

router.get('/((:json/)?:date)', async (req, res, next) => {
    const json = req.params.json == 'json';
    const date = req.params.date;
    if (date == 'today') { res.redirect('/future/' + moment().format('YYYY-MM-DD')); }
    const rooms = [];
    const [rows, fields] = await mysql.promise().execute('SELECT * FROM `resSummary` WHERE `resStart` = ?', [date]).catch(err => {throw err});
    for (let index = 0; index < rows.length; index++) {
        const reservation = rows[index];
        const [rows2, fields] = await mysql.promise().execute('SELECT * FROM `roomView` WHERE `roomID` = ?', [reservation.roomID]).catch(err => {throw err});
        const room = rows2[0];
        if (reservation.depoAdded) {
            reservation.depoAddedString = moment(reservation.depoAdded).format('DD.MM.YYYY HH:MM:SS');
        }
        reservation.resStartString = moment(reservation.resStart).format('DD.MM.YYYY [14:00:00]');
        reservation.resEndString = moment(reservation.resEnd).format('DD.MM.YYYY [10:00:00]');
        reservation.totalDays = Math.ceil((reservation.resEnd.getTime() - reservation.resStart.getTime()) / (1000 * 60 * 60 * 24));
        room.reservation = reservation;
        rooms.push(room);
    }

    res.json({rooms, date, text: moment(date).fromNow()});
});

export default router;