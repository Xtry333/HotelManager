import { Router } from 'express';
import * as PaymentController from '../../controllers/PaymentController';
import { ResourceError } from '../../dtos/Error';

const router = Router();

/* GET payment for reservation id. */
router.get('/:id', async (req, res, next) => {
    try {
        const reservationID = parseInt(req.params.id);
        const payments = await PaymentController.getForReservation(reservationID);
        res.json(payments);
    } catch (error) {
        res.status(error.status).json(error);
    }
});

/* PUT payment or deposit for reservation */
router.put('/:id', async (req, res, next) => {
    try {
        const reservationID = parseInt(req.params.id);
        const type = req.body.type === "deposit" ? "deposit" : req.body.type === "payment" ? "payment" : null;
        const amount = parseFloat(req.body.amount);
        if (type === "payment") {
            const paymentID = await PaymentController.add(reservationID, amount);
            res.status(201).json(paymentID);
        } else if (type === "deposit") {
            const depositID = await PaymentController.deposit(reservationID, amount);
            res.status(201).json(depositID);
        } else {
            throw new ResourceError("Please provide valid payment type", type, 400);
        }
    } catch (error) {
        res.status(error.status).json(error);
    }
});

/* DELETE payment. */
router.delete('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const results = await PaymentController.deleteDepositById(id);
        res.status(200).json(results);
    } catch (error) {
        res.status(error.status).json(error);
    }
});

export default router;