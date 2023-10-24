import api from './api';

export const postReturnRequest = async (requestData) => {
    const endpoint = 'return-request';
    try {
        const response = await api.post(endpoint, requestData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}