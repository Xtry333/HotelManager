import pool from '../js/sql';
import { ResourceError } from '../dtos/Error';
import { RowDataPacket } from 'mysql';
import { Dto } from '../dtos/Dto';

export const dateFormat = 'YYYY-MM-DD';
export const dateTimeFormat = 'YYYY-MM-DD hh:mm';

export async function query(query: string, args?: Array<string | number | boolean>) {
    try {
        if (args) {
            for (let i = 0; i < args.length; i++) {
                if (args[i] === undefined) {
                    throw new ResourceError(`Undefined argument in query in position ${i}.`);
                } else if (args[i] === true) {
                    args[i] = 1;
                } else if (args[i] === false) {
                    args[i] = 0;
                }
            }
            console.info(`Executing query: '${query}' with params ${args}`);//[${args.map(x => `'${x}'`).join(', ')}]`);
        } else {
            console.info(`Executing query: '${query}'`);
        }
        const response = await pool.promise().execute(query, args);
        return response[0] as RowDataPacket[];
    } catch (error) {
        console.log(error);
        throw new ResourceError(`SQL error.`, error, 500);
    }
}

export async function querySelectAll<T extends Dto>(obj: { new(): T; }, where?: { [key: string]: string | number }): Promise<T[]> {
    const results: T[] = [];
    const from = new obj().dtoName;
    const whereValues: any[] = [];
    const whereNames: string[] = [];
    if (where) {
        for (const key in where) {
            if (whereNames.length > 0) {
                whereNames.push(' AND ');
            } else {
                whereNames.push('WHERE ');
            }
            whereValues.push(where[key]);
            whereNames.push(`\`${key}\` = ?`);
        }
    }
    if (!from) {
        throw new ResourceError(`Object ${obj} has no dtoName.`);
    }
    const preparedQuery = `SELECT * FROM \`${from}\` ${whereNames ? whereNames.join('') : undefined}`;
    const rows = await query(preparedQuery, whereValues ? whereValues : undefined) as T[];
    for (const row of rows) {
        const newObj = new obj();
        Object.assign(newObj, row);
        results.push(newObj);
    }
    return results;
}

export async function queryInsert<T extends Dto>(obj: { new(): T; }, valuesObj: { [key: string]: string | number | boolean }) {
    const tableName = new obj().dtoName;
    const values: any[] = [];
    const names = [];
    const placeholders: string[] = [];
    if (!tableName) throw new ResourceError(`Object ${obj} has no dtoName.`, obj, 500);
    if (!valuesObj || Object.keys(valuesObj).length === 0)
        throw new ResourceError(`Cannot insert, no values defined.`, valuesObj, 500);
    for (const key in valuesObj) {
        if (valuesObj[key] != null) {
            if (names.length > 0) {
                names.push(', ');
                placeholders.push(', ');
            }
            values.push(valuesObj[key]);
            names.push(`\`${key}\``);
            placeholders.push('?');
        }
    }

    const preparedQuery = `INSERT INTO \`${tableName}\` (${names.join('')}) VALUES (${placeholders.join('')})`;
    const result = await query(preparedQuery, values) as any;
    return result.insertId as number;
}

export async function queryUpdate<T extends Dto>(obj: { new(): T; }, valuesObj: { [key: string]: string | number | boolean }, whereObj: { [key: string]: string | number }) {
    const tableName = new obj().dtoName;
    const setKeys: string[] = [];
    const whereKeys: string[] = [];
    const values: any[] = [];
    if (!tableName) throw new ResourceError(`Object ${obj} has no dtoName.`, obj, 500);
    if (!valuesObj || Object.keys(valuesObj).length === 0)
        throw new ResourceError(`Cannot update, no values defined.`, valuesObj, 500);
    if (!whereObj || Object.keys(whereObj).length === 0)
        throw new ResourceError(`Cannot update, no values defined.`, whereObj, 500);
    for (const key in valuesObj) {
        setKeys.push(`\`${key}\` = ?`);
        values.push(valuesObj[key]);
    }
    for (const key in whereObj) {
        if (whereKeys.length > 0) {
            whereKeys.push(' AND ');
        } else {
            whereKeys.push('WHERE ');
        }
        whereKeys.push(`\`${key}\` = ?`);
        values.push(whereObj[key]);
    }

    console.info(valuesObj);
    console.info(whereObj);
    const preparedQuery = `UPDATE \`${tableName}\` SET ${setKeys.join(', ')} ${whereKeys.join('')}`;
    const result = await query(preparedQuery, values) as any;
    console.info(result);
    return result;
}