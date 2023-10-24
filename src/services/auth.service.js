import api from './api';

export const registerUser = async (userData) => {
    const endpoint = 'auth/register';
    try {
        const response = await api.post(endpoint, userData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const loginUser = async (loginData) => {
    const endpoint = 'auth/login';
    try {
        const response = await api.post(endpoint, loginData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getProfile = async () => {
    try {
        const response = await api.get('auth/profile');
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const resetPassword = async (passwordData) => {
    const endpoint = 'auth/reset-password';
    try {
        const response = await api.post(endpoint, passwordData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};