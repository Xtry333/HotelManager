import Axios, { AxiosRequestConfig } from 'axios';
import { RouteComponentProps } from 'react-router-dom';

const instance = Axios.create({
    baseURL: 'http://localhost:3001/api/',
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