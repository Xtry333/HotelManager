import { expect } from 'chai';
import * as roomController from '../controllers/RoomController';

describe('Room Controller', () => {
    it('can get a list of free rooms', async () => {
        const rooms = await roomController.getFree('2019-10-15', '2019-10-20');
        console.log(rooms);
    });
});