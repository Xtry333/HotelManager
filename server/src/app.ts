// import createError, { HttpError } from 'http-errors';
// import express from 'express';
// import dotenv from 'dotenv';

// import path from 'path';
// import cookieParser from 'cookie-parser';
// import logger from 'morgan';
// import cors from 'cors';
// import helmet from 'helmet';

// import apiRoute from 'routes/api';
// import indexRouter from 'routes/api/index';

// dotenv.config();

// const app: express.Application = express();


// app.use(helmet());
// app.use(cors());
// app.use(logger('dev'));

// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/api', apiRoute);
// app.use('/', indexRouter);

// // Catch 404 and forward to error handler
// app.use((_req: express.Request, _res: express.Response, next: express.NextFunction) => {
//     next(createError(404));
// });

// // Error handler
// app.use((err: HttpError, req: express.Request, res: express.Response, _next: express.NextFunction) => {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

// export default app;

import { Room } from 'models/RoomDBO';
import { Guest } from 'models/GuestDBO';
import { User } from 'models/UserDBO';
import { Reservation } from 'models/ReservationDBO';
import SequelizeInstance from 'common/SequelizeInstance';
import { IncludeAll } from 'models/Base';

// sequelize.sync({ force: true }).then(async () => {
//     console.log(`Database & tables created!`)
// })

SequelizeInstance.sync({ force: true })
    .then(async () => {
        console.log(`Database & tables created!`)
        const room = await Room.create({ label: "Pokój" });
        const guest = await Guest.create({ firstname: "Michał", lastname: "Woźniak" } as Guest);
        const user = await User.create({ username: 'Xtry333', firstname: "Michał", lastname: "Woźniak" } as User);
        const res = await Reservation.create({ roomId: room.id, guestId: guest.id, creatorId: user.id } as Reservation, { include: [User, Guest, Room] });

        await Reservation.create({ creator: { firstname: "Adb", lastname: "Dab" }, roomId: room.id, guest: { firstname: "Wawawaaw" } } as Reservation, { include: IncludeAll });

        const r = await Reservation.findAll({ include: IncludeAll })
        console.log(JSON.stringify(r, null, 2));
    });