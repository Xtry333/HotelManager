import { Includeable } from 'sequelize/types';
import { Model } from 'sequelize-typescript';

export const IncludeAll: Includeable[] = [{ all: true }];

export class BaseModel<T = any, T2 = any> extends Model<T, T2> {

}
