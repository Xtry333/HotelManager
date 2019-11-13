import { Dto } from './Dto';

export class Payment implements Dto {
	public dtoName = 'payment';
	id: number;
	reservation: number;
	amount: number;
	added: string;
}