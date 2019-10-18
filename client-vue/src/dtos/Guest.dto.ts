import { Dto } from './Dto';

export class Guest implements Dto {
    public dtoName = 'guest';

    id: number;
    firstname: string;
    lastname: string;
    pesel: number;
    phoneNumber: number;
    email: string;
    streetName: string;
    city: string;
    added: number;
    additionalGuestInfo: string;
}