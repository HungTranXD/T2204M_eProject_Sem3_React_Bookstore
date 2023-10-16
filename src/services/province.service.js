import api from './api';

export const getProvinces = async () => {
    const endpoint = `province`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

