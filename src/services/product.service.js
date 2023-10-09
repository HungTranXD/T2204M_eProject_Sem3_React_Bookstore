import api from './api';

export const getProducts = async (filterCriteria) => {
    const endpoint = 'product';
    try {
        const response = await api.post(endpoint, filterCriteria);
        return response.data;
    } catch (error) {
        console.error('Error fetching filtered products:', error);
        return [];
    }
}

export const getProductDetail = async (slug) => {
    const endpoint = `product/slug/${slug}`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        return {};
    }
}