import api from './api';

export const postOrder = async (orderData) => {
    const endpoint = 'order';
    try {
        const response = await api.post(endpoint, orderData);
        return response.data;
    } catch (error) {
        console.log(error);
        return {};
    }
}

export const patchConfirmOrderPayment = async (id) => {
    const endpoint = `order/confirm-payment/${id}`;
    try {
        const response = await api.patch(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        return {};
    }
}