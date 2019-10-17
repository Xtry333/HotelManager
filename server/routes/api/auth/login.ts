import Express, { Router } from 'express';
import { authUser } from '../../../controllers/AuthController';

const router: Router = Router();

/* POST login. */
router.post('/', async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    try {
        const login = req.body;
        login.userAgent = req.headers['user-agent'] || "Empty";
        const result = await authUser(login);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status).json(error);
    }
});

export default router;