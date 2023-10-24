import api from './api';

// Function to upload an image to Cloudinary
export const uploadImage = async (imageFile) => {
    try {
        const formData = new FormData();
        formData.append('file', imageFile);

        const response = await api.post('file/upload-to-cloudinary', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data; // This will contain the image URL on Cloudinary
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }
};

// Function to delete an image from Cloudinary
export const deleteImage = async (imageUrl) => {
    try {
        const response = await api.delete('file/delete-from-cloudinary', {
            data: { imageUrl },
        });

        return response.data; // This will contain a success message
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw error;
    }
};