import api from './api';

export const getProducts = async (filterCriteria) => {
    const endpoint = 'product';
    try {
        const response = await api.post(endpoint, filterCriteria);
        return response.data;
    } catch (error) {
        console.error('Error fetching filtered products:', error);
        throw error;
    }
}

export const searchProducts = async (categoryId, searchString, page, pageSize) => {
    const endpoint = 'product/search';
    try {
        const response = await api.get(endpoint, { params: {categoryId, searchString, page, pageSize} });
        return response.data;
    } catch (error) {
        console.error('Error fetching searched products:', error);
        throw error;
    }
}

export const getProductDetail = async (slug) => {
    const endpoint = `product/${slug}`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getRelatedProducts = async (productId, limit) => {
    const endpoint = `product/related-products/${productId}`;
    try {
        const response = await api.get(endpoint, {params: {limit}});
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getPublishYears = async () => {
    const endpoint = 'product/publish-years';
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.error('Error fetching publish years:', error);
        throw error;
    }
}