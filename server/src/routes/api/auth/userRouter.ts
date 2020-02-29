import Express, { Router } from 'express';
import * as UserController from '../../../controllers/UserController';

const router = Express.Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
    try {
        const users = await UserController.getAll();
        res.json(users);
    } catch (error) {
        res.status(error.status).json(error)
    }
});

/* GET user with id. */
router.get('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const user = await UserController.getById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(error.status).json(error);
    }
});

/* POST user. */
router.post('/', async (req, res, next) => {
    try {
        const post = req.body.guest;
        const user = await UserController.create(post);
        res.status(201).json(user);
    } catch (error) {
        res.status(error.status).json(error);
    }
});

/* PUT user */
router.put('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const userObject = req.body.user;
        const user = await UserController.updateById(id, userObject);
        res.status(200).json(user);
    } catch (error) {
        res.status(error.status).json(error);
    }
});

/* DELETE user. */
router.delete('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const results = await UserController.deleteById(id);
        res.status(200).json(results);
    } catch (error) {
        res.status(error.status).json(error);
    }
});

export default router;