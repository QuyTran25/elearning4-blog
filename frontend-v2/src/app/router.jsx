import { createBrowserRouter, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import HomePage from '../features/blogs/pages/HomePage';
import BlogDetailPage from '../features/blogs/pages/BlogDetailPage';
import AdminLoginPage from '../features/auth/pages/AdminLoginPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import CreatePostPage from '../features/dashboard/pages/CreatePostPage';
import EditPostPage from '../features/dashboard/pages/EditPostPage';
import ModerationLogsPage from '../features/moderation/pages/ModerationLogsPage';
import ProtectedRoute from '../features/auth/components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/blog/:id',
        element: <BlogDetailPage />,
      },
    ],
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    element: <AdminLayout />,
    children: [
      {
        path: '/admin/dashboard',
        element: <Navigate to="/admin/posts/create" replace />,
      },
      {
        path: '/admin/posts/create',
        element: <ProtectedRoute><CreatePostPage /></ProtectedRoute>,
      },
      {
        path: '/admin/posts/edit/:id',
        element: <ProtectedRoute><EditPostPage /></ProtectedRoute>,
      },
      {
        path: '/admin/logs',
        element: <ProtectedRoute><ModerationLogsPage /></ProtectedRoute>,
      },
    ],
  },
]);
