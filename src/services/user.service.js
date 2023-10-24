import api from './api';

export const getLikedProducts = async () => {
    const endpoint = `user/liked-products`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const likeOrUnlikeProduct = async (id) => {
    const endpoint = `user/like-product/${id}`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const updateUserProfile = async (updateData) => {
    const endpoint = `user/update-profile`;
    try {
        const response = await api.put(endpoint, updateData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getOrderHistory = async () => {
    const endpoint = `user/order-history`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getOrderHistoryDetail = async (code) => {
    const endpoint = `user/order-detail/${code}`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getReturnRequestHistory = async () => {
    const endpoint = `user/return-request-history`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getReturnRequestHistoryDetail = async (id) => {
    const endpoint = `user/return-request/${id}`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

