import api from './api';

export const postOrder = async (orderData) => {
    const endpoint = 'order';
    try {
        const response = await api.post(endpoint, orderData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getOrderTracking = async ({code, email}) => {
    const endpoint = `order/order-tracking`;
    try {
        const response = await api.get(endpoint, { params: {code, email} });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const patchConfirmOrderPayment = async (code) => {
    const endpoint = `order/confirm-payment/${code}`;
    try {
        const response = await api.patch(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const cancelOrder = async (cancelData) => {
    const endpoint = 'order/cancel-order';
    try {
        const response = await api.post(endpoint, cancelData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const confirmReceivedOrder = async (confirmData) => {
    const endpoint = 'order/confirm-received-order';
    try {
        const response = await api.post(endpoint, confirmData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const postReview = async (reviewData) => {
    const endpoint = 'review';
    try {
        const response = await api.post(endpoint, reviewData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

