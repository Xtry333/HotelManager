import { Dto } from './Dto';

export class Setting implements Dto {
    dtoName = 'settings';
    name: string;
    value: string;

    constructor(name?: string, value?: string | number | boolean) {
        if (name) {
            this.name = name;
            if (value) {
                this.value = value.toString();
            }
        }
    }
}