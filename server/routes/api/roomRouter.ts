import Express from 'express';
import * as RoomController from '../../controllers/RoomController';
import moment from 'moment';
import { dateFormat } from '../../js/query';

const router = Express.Router();

/* GET free rooms for date. */
router.get('/free/:start/:end', async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    try {
        const start = moment(req.params.start).format(dateFormat);
        const end = moment(req.params.end).format(dateFormat);
        res.json(await RoomController.getFree(start, end));
    } catch (error) {
        res.status(error.status).json(error);
    }
});


/* GET room with id. */
router.get('/:id?', async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        if (id) {
            res.json(await RoomController.getById(id));
        } else {
            res.json(await RoomController.getAll());
        }
    } catch (error) {
        res.status(error.status).json(error);
    }
});

export default router;
