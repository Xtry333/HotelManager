import Express from 'express';
import * as ResController from '../../controllers/ReservationController';

const router = Express.Router();

// GET all reservations summary view
router.get('/summary/:id?', async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    const resID = parseInt(req.params.id);
    const roomID = parseInt(req.query.room);
    const guestID = parseInt(req.query.guest);
    try {
        if (resID) {
            res.json(await ResController.getSummaryById(resID));
        } else {
            const args = roomID || guestID ? { roomID, guestID } : undefined;
            res.json(await ResController.getAllResSummaryView(args));
        }
    } catch (error) {
        res.status(error.status).json(error);
    }
});

// GET currently active reservations.
router.get('/current/:date?', async (req, res, next) => {
    try {
        const date: string | undefined = req.params.date;
        res.json(await ResController.getCurrentForDate(date));
    } catch (error) {
        res.status(error.status).json(error);
    }
});

/* GET all reservations. */
router.get('/:id?', async (req, res, next) => {
    const resID = parseInt(req.params.id);
    const roomID = parseInt(req.query.room);
    const guestID = parseInt(req.query.guest);
    try {
        if (resID) {
            res.json(await ResController.getById(resID));
        } else {
            const args = roomID || guestID ? { room: roomID, guest: guestID } : undefined;
            res.json(await ResController.getAll(args));
        }
    } catch (error) {
        res.status(error.status).json(error);
    }
});

/* POST reservation, create guest if necesary and given. */
router.post('/', async (req, res, next) => {
    try {
        const resObject = req.body.reservation;
        const guestObject = req.body.guest;
        const reservation = await ResController.create(resObject, guestObject);
        res.status(201).json(reservation);
    } catch (error) {
        res.status(error.status).json(error);
    }
});

/* PUT reservation */
router.put('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const resObject = req.body.reservation;
        const reservation = await ResController.updateById(id, resObject);
        res.status(200).json(reservation);
    } catch (error) {
        res.status(error.status).json(error);
    }
});

/* DELETE reservation. */
router.delete('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const results = await ResController.deleteById(id);
        res.status(200).json(results);
    } catch (error) {
        res.status(error.status).json(error);
    }
});

export default router;