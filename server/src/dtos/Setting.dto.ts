import { Dto } from './Dto';
import { now } from 'moment';

export class Setting implements Dto {
    dtoName = 'settings';
    readonly name: string;
    readonly value: string;
    cachedTime: number;

    constructor (name?: string, value?: string | number | boolean) {
        if (name) {
            this.name = name;
            if (value) {
                this.value = value.toString();
            }
        }
        this.cachedTime = now();
    }
}
