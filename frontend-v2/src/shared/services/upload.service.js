import apiClient from './api';

/**
 * Upload image file
 * API: POST /blogs/upload
 * IMPORTANT: Preserves existing upload behavior
 * Backend expects: FormData with 'image' field
 * Returns: { success, data: { url, path } }
 */
export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post('/blogs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Export as service object
export default {
  uploadImage,
};
