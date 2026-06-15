import apiClient from './api';

/**
 * Get list of blogs with optional search and sorting
 * Supports: ?search=term&sort=asc|desc
 */
export const getBlogs = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/blogs?${queryString}` : '/blogs';
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get single blog by ID
 * Returns full blog object with author info
 */
export const getBlogById = async (id) => {
  try {
    const response = await apiClient.get(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create new blog post
 * Sends JSON with: title, content, category_id, image_url (URL string from upload)
 */
export const createBlog = async (data) => {
  try {
    const response = await apiClient.post('/blogs', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update existing blog post
 * Sends JSON with: title, content, category_id, image_url
 */
export const updateBlog = async (id, data) => {
  try {
    const response = await apiClient.put(`/blogs/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete blog post by ID
 * Returns success response
 */
export const deleteBlog = async (id) => {
  try {
    const response = await apiClient.delete(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Upload blog image
 * Accepts FormData with 'image' field
 * Returns: { success: true, data: { url: 'path/to/image' } }
 */
export const uploadBlogImage = async (formData) => {
  try {
    const response = await apiClient.post('/blogs/upload-image', formData);
    return response.data;
  } catch (error) {
    console.error('Image upload failed:', error);
    throw error;
  }
};

// Export as service object
export default {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadBlogImage,
};
