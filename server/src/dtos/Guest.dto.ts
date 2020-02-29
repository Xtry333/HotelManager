import { Dto } from './Dto';

export class Guest implements Dto {
    public dtoName = 'guest';

    id: number;
    firstname: string;
    lastname: string;
    pesel: number;
    email: string;
    phoneNumber: number;
    streetName: string;
    houseNumber: string;
    city: string;
    added: number;
    additionalGuestInfo: string;
}