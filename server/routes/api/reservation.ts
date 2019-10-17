import { Router } from 'express';
import * as ResController from '../../controllers/ReservationController';

const router = Router();

/* GET reservations. */
router.get('/', async (req, res, next) => {
    try {
        const reservations = await ResController.getAll();
        res.json(reservations);
    } catch (error) {
        res.status(error.status).json(error);
    }
});

/* GET reservation summary with id. */
router.get('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const reservation = await ResController.getSummaryById(id);
        res.json(reservation);
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

/* DELETE reservation. */
router.delete('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const reservation = await ResController.deleteById(id);
        res.status(200).json(reservation);
    } catch (error) {
        res.status(error.status).json(error);
    }
});

export default router;