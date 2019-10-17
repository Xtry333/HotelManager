import Axios from 'axios';

const instance = Axios.create({
    baseURL: 'http://localhost:3001/api/',
    timeout: 5000,
    headers: {
        'Access-Control-Allow-Origin': '*',
    }
});

export default instance;

export function Get(url, config) {
    console.info(`Getting ${url}.`);
    const token = localStorage.getItem('token');
    const response = instance.get(url, { ...config, headers: { 'Auth-Token': token } });
    
    return response;
}