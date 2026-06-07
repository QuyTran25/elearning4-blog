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
 * IMPORTANT: Preserves FormData (not converted to JSON)
 * Backend expects: title, content, category_id, image_url
 */
export const createBlog = async (formData) => {
  try {
    // Do NOT convert FormData to JSON
    const response = await apiClient.post('/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update existing blog post
 * IMPORTANT: Preserves FormData for compatibility
 * Backend expects: title, content, category_id, image_url
 * Laravel expects _method=PUT for FormData POST
 */
export const updateBlog = async (id, formData) => {
  try {
    // Append _method for Laravel FormData PUT compatibility
    formData.append('_method', 'PUT');

    const response = await apiClient.post(`/blogs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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

// Export as service object
export default {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
