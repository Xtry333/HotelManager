import express from 'express';
const router = express.Router();
import * as GuestController from '../../controllers/GuestController';

/* GET guests listing. */
router.get('/', async (req, res, next) => {
    try {
        const guests = await GuestController.getAll();
        res.json(guests);
    } catch (error) {
        res.status(error.status).json(error)
    }
});

/* GET guest with id. */
router.get('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const guest = await GuestController.getById(id);
        res.status(200).json(guest);
    } catch (error) {
        res.status(error.status).json(error);
    }
});

/* POST guest. */
router.post('/', async (req, res, next) => {
    try {
        const post = req.body.guest;
        const guest = await GuestController.create(post);
        res.status(201).json(guest);
    } catch (error) {
        res.status(error.status).json(error);
    }
});

/* DELETE guest. */
router.delete('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const results = await GuestController.deleteById(id);
        res.status(200).json(results);
    } catch (error) {
        res.status(error.status).json(error);
    }
});

export default router;