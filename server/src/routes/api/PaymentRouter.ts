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

/* PUT payment for reservation id */
router.put('/:id', async (req, res, next) => {
    try {
        const reservationID = parseInt(req.params.id);
        const amount = parseFloat(req.body.amount);
        const type = req.body.type;
        const paymentID = await PaymentController.add(reservationID, amount, type);
        res.status(201).json(paymentID);
    } catch (error) {
        res.status(error.status).json(error);
    }
});

/* DELETE payment. */
router.delete('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const results = await PaymentController.deletePaymentById(id);
        res.status(200).json(results);
    } catch (error) {
        res.status(error.status).json(error);
    }
});

export default router;