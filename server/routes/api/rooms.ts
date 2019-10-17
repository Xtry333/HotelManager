import Express from 'express';
import * as RoomController from '../../controllers/RoomController';

const router = Express.Router();

/* GET rooms listing. */
router.get('/', async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    try {
        const rooms = await RoomController.getAll();
        res.json(rooms);
    } catch (error) {
        res.status(error.status).json(error);
    }
});

/* GET room with id. */
router.get('/:id', async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const room = await RoomController.getById(id);
        res.json(room);
    } catch (error) {
        res.status(error.status).json(error);
    }
});

export default router;
