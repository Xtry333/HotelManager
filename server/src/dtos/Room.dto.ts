import { Dto } from './Dto';

export class Room implements Dto {
    dtoName = 'room';
    id: number;
    number: number;
    floor: number;
    spots: number;
}

export class RoomView implements Dto {
    public dtoName = 'roomView';
    roomID: number;
    roomNumber: number;
    floorNumber: number;
    spots: number;
    floorColor: string;
    floorCaption: string;
    defaultImageLink: string;
    images: RoomImagesLink[];
}

export class RoomImagesLink implements Dto {
    public dtoName = 'roomImages';
    id: number;
    room: number;
    imageLink: string;
    default: boolean;
    created: Date;
    added: Date;
}
