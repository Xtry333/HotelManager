import Express, { Router } from 'express';
var router = Express.Router();

/* GET users listing. */
router.get('/', function(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    res.json({message: 'respond with a resource'});
});

export default router;