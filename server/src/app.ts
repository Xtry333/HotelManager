import createError, { HttpError } from 'http-errors';
import express from 'express';
import dotenv from 'dotenv';

import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

import apiRoute from 'routes/api';
import indexRouter from 'routes/api/index';

dotenv.config();

const app: express.Application = express();


app.use(helmet());
app.use(cors());
app.use(logger('dev'));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRoute);
app.use('/', indexRouter);

// Catch 404 and forward to error handler
app.use((_req: express.Request, _res: express.Response, next: express.NextFunction) => {
    next(createError(404));
});

// Error handler
app.use((err: HttpError, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;
