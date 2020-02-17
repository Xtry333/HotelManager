import Express, { Router } from 'express';
import * as UserController from '../../../controllers/UserController';

const router = Express.Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
    try {
        const guests = await UserController.getAll();
        res.json(guests);
    } catch (error) {
        res.status(error.status).json(error)
    }
});

/* GET user with id. */
router.get('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const guest = await UserController.getById(id);
        res.status(200).json(guest);
    } catch (error) {
        res.status(error.status).json(error);
    }
});

export default router;