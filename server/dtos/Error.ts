import { Dto } from "./Dto";

export class ResourceError implements Dto {
    public readonly dtoName = 'error';
    public readonly error = true;
    public readonly object?: any;
    public readonly message: string;
    public readonly status: number = 500;

    constructor(message: string, object?: any, status?: number) {
        this.message = message;
        this.object = object;
        if (status) {
            this.status = status;
        }
    }
}
