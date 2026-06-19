import apiClient from './api';

/**
 * Classify a comment using AI model
 */
export const classifyComment = async (commentText) => {
  // Not used directly by UI now, handled by CommentController store()
  // Kept for backward compatibility if needed
  return { success: true };
};

/**
 * Get moderation logs
 */
export const getModerationLogs = async (params = {}) => {
  const response = await apiClient.get('/moderation/logs', { params });
  return response.data;
};

/**
 * Get statistics about moderation
 */
export const getModerationStats = async () => {
  const response = await apiClient.get('/moderation/stats');
  return response.data;
};

export default {
  classifyComment,
  getModerationLogs,
  getModerationStats,
};
