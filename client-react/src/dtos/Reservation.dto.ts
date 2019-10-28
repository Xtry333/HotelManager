import { Dto } from './Dto';

export class Reservation implements Dto {
	public dtoName = 'reservation';
	id: number;
	room: number;
	guest: number;
	numberOfPeople: number;
	pricePerDay: number;
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
	pricePerDay: number;
	resAdded: Date | string;
	resStart: Date | string;
	resEnd: Date | string;
	depoAmount: number;
	depoAdded: Date | string;
	paymAmount: number;
	paymAdded: Date | string;
	additionalResInfo: string;
}