import Express, { Router } from 'express';
import { query } from '../../../js/query';
import { request } from 'https';
import { RowDataPacket } from 'mysql';
import { ResourceError } from '../../../dtos/Error';

const router = Router();

/* GET token. */
router.get('/', async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    try {
        const token = req.body.token;
        console.log(token)
        if (!token) throw new ResourceError(`Please provide a valid token`, token, 400);
        const results = await query('SELECT * FROM `token` WHERE `token` = ?', [token]);
        if (results.length == 1) {
            res.status(200).json(results[0]);
        } else {
            res.status(401).json({ error: { message: "Not logged" } });
        }
    } catch (error) {
        console.error(error);
    }
});

/* DELETE token. */
router.delete('/', async (req, res, next) => {
    const token = req.body.token;
    query('DELETE FROM `token` WHERE `token` = ?', [token]).catch(err => console.log(err));
    res.json(200);
});

export default router;