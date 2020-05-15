import { Request, Response, NextFunction } from 'express';
import { IncludeAll, BaseModel } from 'models/Base';

type NonAbstract<T> = { [P in keyof T]: T[P] };
type Constructor<T> = (new () => T);
type NonAbstractTypeOfModel<T> = Constructor<T> & NonAbstract<typeof BaseModel>;

export abstract class GenericController<T extends BaseModel<T>> {
    public modelObj: NonAbstractTypeOfModel<T>;
    public constructor(obj: NonAbstractTypeOfModel<T>) {
        this.modelObj = obj;
    }

    public index = async (req: Request, res: Response, next: NextFunction) => {
        const all = await this.modelObj.findAll();
        res.json(all);
    }

    public showOne = async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id);
        const single = await this.modelObj.findByPk(id, { include: IncludeAll });
        res.json(single);
    }

    public createOne = async (req: Request, res: Response, next: NextFunction) => {
        const obj = req.body as T;
        const single = await this.modelObj.create(obj, { include: IncludeAll });
        res.json(single);
    }

    public editOne = async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id);
        const obj = req.body as T;
        const single = await this.modelObj.update(obj, { where: { id } });
        res.json(single);
    }

    public deleteOne = async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id);
        const single = await this.modelObj.destroy({ where: { id } });
        res.json(single);
    }
}
