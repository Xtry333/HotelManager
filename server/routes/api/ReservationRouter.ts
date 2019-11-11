import { Router } from 'express';
import * as ResController from '../../controllers/ReservationController';

const router = Router();

// GET all reservations summary view
router.get('/summary/', async (req, res, next) => {
    try {
        const reservations = await ResController.getAllResSummaryView();
        res.json(reservations);
    } catch (error) {
        res.status(error.status).json(error);
    }
});

// GET reservation summary view for id
router.get('/summary/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const reservations = await ResController.getSummaryById(id);
        res.json(reservations);
    } catch (error) {
        res.status(error.status).json(error);
    }
});

/* GET all reservations. */
router.get('/', async (req, res, next) => {
    const roomID = parseInt(req.query.room);
    try {
        const reservations = roomID ? await ResController.getAllForRoom(roomID) : await ResController.getAll();
        res.json(reservations);
    } catch (error) {
        res.status(error.status).json(error);
    }
});

/* GET reservation with id. */
router.get('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const reservation = await ResController.getById(id);
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