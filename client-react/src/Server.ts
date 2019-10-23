import Axios, { AxiosRequestConfig } from 'axios';
import { RouteComponentProps } from 'react-router-dom';

import * as config from './app.config';
import { Dto } from './dtos/Dto';
import { ResourceError } from './dtos/Error';

const instance = Axios.create({
    baseURL: config.apiHostAddres,
    timeout: 5000,
    headers: {
        'Access-Control-Allow-Origin': '*',
    }
});

export default instance;

export function Get(url: string, config?: AxiosRequestConfig, history?: RouteComponentProps["history"]) {
    try {
        console.info(`Getting ${url}.`);
        const token = localStorage.getItem('token');
        const response = instance.get(url, { ...config, headers: { 'Auth-Token': token } });
        return response;
    } catch (error) {
        console.error(error.response);
        if (error.response && error.response.status === 401 && history) {
            history.push('/logout');
        } else {
            throw error;
        }
    }
}

export function Delete(url: string, config?: AxiosRequestConfig, history?: RouteComponentProps["history"]) {
    try {
        console.info(`Deleting ${url}.`);
        const token = localStorage.getItem('token');
        const response = instance.delete(url, { ...config, headers: { 'Auth-Token': token } });
        return response;
    } catch (error) {
        console.error(error.response);
        if (error.response && error.response.status === 401 && history) {
            history.push('/logout');
        } else {
            throw error;
        }
    }
}

export async function GetAllBy<T extends Dto>(url: string, obj: { new(): T; }, history?: RouteComponentProps["history"]) {
    try {
        const expectedDtoName = (new obj).dtoName;
        const response = await Get(url, {}, history);
        const resArray: T[] = [];
        for (const dto of response.data) {
            if (dto.dtoName === expectedDtoName) {
                resArray.push(dto);
            } else {
                throw new ResourceError('Response from server does not match expected DTO.', response);
            }
        }
        return resArray;

    } catch (error) {
        if (error.response && error.response.status === 401) {
            //this.setState({ singout: true });
        }
        console.error(error);
    }
}