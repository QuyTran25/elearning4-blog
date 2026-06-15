import apiClient from './api';

/**
 * Lấy danh sách bình luận của một bài viết
 * GET /api/blogs/{blogId}/comments
 */
export const getComments = async (blogId) => {
  try {
    const response = await apiClient.get(`/blogs/${blogId}/comments`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Tạo bình luận mới
 * POST /api/blogs/{blogId}/comments
 * Body: { author_name: string, content: string }
 */
export const createComment = async (blogId, data) => {
  try {
    const response = await apiClient.post(`/blogs/${blogId}/comments`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getComments,
  createComment,
};
