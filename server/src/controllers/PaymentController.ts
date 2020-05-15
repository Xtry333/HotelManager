import { Request, Response, NextFunction } from 'express';
import * as Db from '../common/query';
import { ResourceError } from '../dtos/Error';
import moment from 'moment';
import { Payment as PaymentDto } from '../dtos/Payment.dto';
import { GenericController } from './GenericController';
import { Payment } from 'models/PaymentDBO';
import { IncludeAll } from 'models/Base';

const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD hh:mm';

class PaymentController extends GenericController<Payment> {
    public index = async (req: Request, res: Response, next: NextFunction) => {
        const resId = parseInt(req.params.resId);
        const paymId = parseInt(req.params.paymId);
        const all = await Payment.findAll({ where: { reservationId: resId }, include: IncludeAll });
        res.json(all);
    }

    public createOne = async (req: Request, res: Response, next: NextFunction) => {
        const resId = parseInt(req.params.resId);
        const obj = req.body as Payment;
        obj.reservationId = resId;
        const single = await this.modelObj.create(obj);
        res.json(single);
    }
}

export default new PaymentController(Payment);

export async function getForReservation(reservationID: number) {
    if (!reservationID) { throw new ResourceError('Reservation ID has not been specified.', reservationID, 400); }
    const paymentRows = await Db.querySelectAll(PaymentDto, { reservation: reservationID });
    if (paymentRows) {
        return paymentRows;
    } else {
        throw new ResourceError(`Could not get payments for Reservation ID ${reservationID}.`, reservationID, 500);
    }
}

export async function add(reservationID: number, amount: number, type: string = 'payment') {
    if (!reservationID) { throw new ResourceError('Reservation ID has not been specified.', reservationID, 400); }
    if (!amount) { throw new ResourceError('Amount has not been specified.', reservationID, 400); }

    const newObj = {} as PaymentDto;
    newObj.reservation = reservationID;
    newObj.added = moment().format(dateTimeFormat);
    newObj.amount = amount;
    newObj.type = type;

    const paymentID = await Db.queryInsert(PaymentDto, { ...newObj });
    return paymentID;
}

export async function deletePaymentById(paymentID: number) {
    if (paymentID) {
        await Db.query('DELETE FROM `payment` WHERE `id` = ?', [paymentID]);
        return true;
    } else {
        throw new ResourceError(`Payment ID ${paymentID} does not exist.`, undefined, 404);
    }
}
