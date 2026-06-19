import apiClient from './api';

/**
 * Lấy danh sách bình luận của một bài viết
 */
export const getComments = async (blogId) => {
  const response = await apiClient.get(`/blogs/${blogId}/comments`);
  return response.data;
};

/**
 * Tạo bình luận mới (gửi qua AI classify)
 */
export const createComment = async (blogId, data) => {
  const response = await apiClient.post(`/blogs/${blogId}/comments`, data);
  return response.data;
};

/**
 * Kiểm tra thô tục nhanh (type-ahead)
 */
export const quickCheck = async (blogId, text) => {
  const response = await apiClient.post(`/blogs/${blogId}/comments/classify`, { text });
  return response.data;
};

/**
 * Confirm post (y/n)
 */
export const confirmPost = async (blogId, data) => {
  const response = await apiClient.post(`/blogs/${blogId}/comments/confirm`, data);
  return response.data;
};

/**
 * Xóa bình luận (Admin)
 */
export const deleteComment = async (commentId) => {
  const response = await apiClient.delete(`/comments/${commentId}`);
  return response.data;
};

/**
 * Lấy chi tiết bình luận (Admin)
 */
export const getCommentDetail = async (commentId) => {
  const response = await apiClient.get(`/comments/${commentId}/detail`);
  return response.data;
};

export default {
  getComments,
  createComment,
  quickCheck,
  confirmPost,
  deleteComment,
  getCommentDetail,
};
