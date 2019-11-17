import { Dto } from './Dto';

export class Payment implements Dto {
	public dtoName = 'payment';
	id: number;
	reservation: number;
	amount: number;
	added: string;
}

export class Deposit implements Dto {
	public dtoName = 'deposit';
	id: number;
	reservation: number;
	amount: number;
	added: string;
	returned: boolean;
}