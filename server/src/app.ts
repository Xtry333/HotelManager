import createError, { HttpError } from 'http-errors';
import express from 'express';
import dotenv from 'dotenv';

import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config();

const app: express.Application = express();

app.use(helmet());
app.use(cors());
app.use(logger('dev'));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/rooms', RoomController.index);
app.post('/rooms', RoomController.createOne);
app.get('/room/:id', RoomController.showOne);
app.put('/room/:id', RoomController.editOne);
app.delete('/room/:id', RoomController.deleteOne);

app.get('/rooms/free/:start/:end', RoomController.getFree);

app.get('/users', UserController.index);
app.post('/users', UserController.createOne);
app.get('/user/:id', UserController.showOne);
app.put('/user/:id', UserController.editOne);
app.delete('/user/:id', UserController.deleteOne);

app.get('/guests', GuestController.index);
app.post('/guests', GuestController.createOne);
app.get('/guest/:id', GuestController.showOne);
app.put('/guest/:id', GuestController.editOne);
app.delete('/guest/:id', GuestController.deleteOne);

app.get('/reservations', ReservationController.index);
app.post('/reservations', ReservationController.createOne);
app.get('/reservation/:id', ReservationController.showOne);
app.put('/reservation/:id', ReservationController.editOne);
app.delete('/reservation/:id', ReservationController.deleteOne);

app.get('/reservation/:resId/payments', PaymentController.index);
app.post('/reservation/:resId/payments', PaymentController.createOne);
app.put('/reservation/:resId/payment/:id', PaymentController.editOne);
app.delete('/reservation/:resId/payment/:id', PaymentController.deleteOne);



// Catch 404 and forward to error handler
app.use((_req: express.Request, _res: express.Response, next: express.NextFunction) => {
    next(createError(404));
});

// Error handler
app.use((err: HttpError, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.locals.message = err.message;

    res.status(err.status || 500).json({ error: err });
});

export default app;

import { Room } from 'models/RoomDBO';
import { Guest } from 'models/GuestDBO';
import { User } from 'models/UserDBO';
import { Reservation } from 'models/ReservationDBO';
import SequelizeInstance from 'common/SequelizeInstance';
import { IncludeAll } from 'models/Base';
import ReservationController from 'controllers/ReservationController';
import RoomController from 'controllers/RoomController';
import PaymentController from 'controllers/PaymentController';
import GuestController from 'controllers/GuestController';
import UserController from 'controllers/UserController';

// sequelize.sync({ force: true }).then(async () => {
//     console.log(`Database & tables created!`)
// })

// SequelizeInstance.sync({ force: true })
//     .then(async () => {
//         console.log(`Database & tables created!`)
//         const room = await Room.create({ label: "Pokój" });
//         const guest = await Guest.create({ firstname: "Michał", lastname: "Woźniak" } as Guest);
//         const user = await User.create({ username: 'Xtry333', firstname: "Michał", lastname: "Woźniak" } as User);
//         const res = await Reservation.create({ roomId: room.id, guestId: guest.id, creatorId: user.id } as Reservation, { include: [User, Guest, Room] });

//         await Reservation.create({ creator: { firstname: "Adb", lastname: "Dab" }, roomId: room.id, guest: { firstname: "Wawawaaw" } } as Reservation, { include: IncludeAll });

//         const r = await Reservation.findAll({ include: IncludeAll })
//         console.log(JSON.stringify(r, null, 2));
//     });