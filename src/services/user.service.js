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