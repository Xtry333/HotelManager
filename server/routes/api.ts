import express from 'express';

import tokenRouter from './api/auth/token';
import loginRouter from './api/auth/login';
import usersRouter from './api/auth/users';
import roomsRouter from './api/rooms';
import ReservationRouter from './api/ReservationRouter';
import futureRouter from './api/future';
import confirmRouter from './api/confirmReservation';
import guestsRouter from './api/guests';

import { isAuthorized } from '../controllers/AuthController';

const api: express.Router = express.Router();

// api.use('/', (req: express.Request, res: express.Response) => {
//     res.render('api');
// });

api.use('/confirm', confirmRouter);
api.use('/login', loginRouter);
api.use('/token', tokenRouter);

// After here all requests require a X-Token header
api.use(isAuthorized); 
api.use('/user', usersRouter);
api.use('/room', roomsRouter);
api.use('/guest', guestsRouter);
api.use('/reservation', ReservationRouter);
api.use('/future', futureRouter);

export default api;