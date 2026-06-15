import apiClient from './api';

/**
 * Login with email and password
 * Preserves backend response shape exactly
 */
export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });

    // Store token and user data in localStorage (as per existing frontend)
    if (response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
    }
    if (response.data.user) {
      localStorage.setItem('admin_user', JSON.stringify(response.data.user));
      if (response.data.user.role) {
        localStorage.setItem('admin_role', response.data.user.role);
      }
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout - clear token from backend
 * Gracefully handles API failure
 */
export const logout = async () => {
  try {
    const response = await apiClient.post('/auth/logout');
    // Clear local storage regardless
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_role');
    return response.data;
  } catch (error) {
    // Even if logout API fails, clear local storage
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_role');
    throw error;
  }
};

/**
 * Get current authenticated user
 * Returns backend response as-is (no transformation)
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/user');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Export as service object for consistency
export default {
  login,
  logout,
  getCurrentUser,
};
