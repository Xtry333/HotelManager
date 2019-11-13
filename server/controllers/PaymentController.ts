import * as Db from '../js/query';
import { ResourceError } from '../dtos/Error';
import moment from 'moment';
import { Payment as PaymentDto, Deposit as DepositDto } from '../dtos/Payment.dto';

const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD hh:mm';

export async function getForReservation(reservationID: number) {
    if (!reservationID)
        throw new ResourceError(`Reservation ID has not been specified.`, reservationID, 400);
    const paymentRows = await Db.querySelectAll(PaymentDto, { reservation: reservationID });
    const depositRows = await Db.querySelectAll(DepositDto, { reservation: reservationID });
    if (paymentRows && depositRows) {
        return { payments: paymentRows, deposits: depositRows };
    } else {
        throw new ResourceError(`Could not get payments for Reservation ID ${reservationID}.`, reservationID, 500);
    }
}

export async function add(reservationID: number, amount: number) {
    if (!reservationID)
        throw new ResourceError(`Reservation ID has not been specified.`, reservationID, 400);
    if (!amount)
        throw new ResourceError(`Amount has not been specified.`, reservationID, 400);

    const newObj = {} as PaymentDto;
    newObj.added = moment().format(dateFormat);
    newObj.amount = amount;

    const paymentID = await Db.queryInsert(PaymentDto, { ...newObj });
    return paymentID;
}

export async function deposit(reservationID: number, amount: number) {
    if (!reservationID)
        throw new ResourceError(`Reservation ID has not been specified.`, reservationID, 400);
    if (!amount)
        throw new ResourceError(`Amount has not been specified.`, reservationID, 400);

    const newObj = {} as PaymentDto;
    newObj.added = moment().format(dateFormat);
    newObj.amount = amount;

    const depositID = await Db.queryInsert(DepositDto, { ...newObj });
    return depositID;
}

export async function deletePaymentById(paymentID: number) {
    if (paymentID) {
        await Db.query('DELETE FROM `payment` WHERE `id` = ?', [paymentID]);
        return true;
    } else {
        throw new ResourceError(`Payment ID ${paymentID} does not exist.`, undefined, 404);
    }
}

export async function deleteDepositById(depositID: number) {
    if (depositID) {
        await Db.query('DELETE FROM `deposit` WHERE `id` = ?', [depositID]);
        return true;
    } else {
        throw new ResourceError(`Deposit ID ${depositID} does not exist.`, undefined, 404);
    }
}