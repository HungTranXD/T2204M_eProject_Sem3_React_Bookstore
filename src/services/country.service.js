import api from './api';

export const getCountries = async () => {
    const endpoint = `country`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}