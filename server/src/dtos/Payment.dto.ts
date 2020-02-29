import { Dto } from './Dto';

export class Payment implements Dto {
	public dtoName = 'payment';
	id: number;
	type: string;
	reservation: number;
	amount: number;
	added: string;
	returned: boolean;
}
