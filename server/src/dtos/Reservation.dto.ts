import { Dto } from './Dto';

export class Reservation implements Dto {
	public dtoName = 'reservation';
	id: number;
	room: number;
	guest: number;
	numberOfPeople: number;
	pricePerDay: number;
	status: string;
	token: string;
	added: number;
	start: number;
	end: number;
	deleted: boolean;
	additionalResInfo: string;
}

export class ResSummaryView implements Dto {
	public dtoName = 'resSummary';
	resID: number;
	roomID: number;
	guestID: number;
	depoID: number;
	paymID: number;
	resToken: string;
	guestFirstname: string;
	guestLastname: string;
	guestPhoneNumber: string;
	numberOfPeople: number;
	roomSpots: number;
	pricePerDay: number;
	resStatus: string;
	resAdded: Date;
	resStart: Date;
	resEnd: Date;
	depoAmount: number;
	depoAdded: Date;
	paymAmount: number;
	paymAdded: Date;
	additionalResInfo: string;
}
