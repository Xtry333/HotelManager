import * as Db from 'common/query';
import { Reservation as ReservationDto } from 'dtos/Reservation.dto';

const Reservation = {
    async getAll(vars?: { [key: string]: string | number }) {
        const args: { [key: string]: string | number } = {};
        for (const key in vars) {
            if (vars[key]) {
                args[key] = vars[key];
            }
        }
        const rows = await Db.querySelectAll(ReservationDto, args);
    }
}

export default Reservation;