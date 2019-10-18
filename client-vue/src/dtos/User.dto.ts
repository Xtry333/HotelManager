import { Dto } from './Dto';

export class User implements Dto {
    dtoName = 'user';
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    password: string;
    created: number;
    additionalInfo: string;
}

export class Token implements Dto {
    dtoName = 'token';
    id: number;
    token: string;
    user: number | User;
    userAgent: string;
    created: Date;
    accessed: Date;
}