import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Admin Portal</h2>
        <p className="text-gray-400 text-sm">Core Management</p>
      </div>

      <nav className="space-y-4">
        <Link
          to="/admin/dashboard"
          className="block px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Post Management
        </Link>
        <Link
          to="/admin/posts/create"
          className="block px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Create New Post
        </Link>
        <Link
          to="/admin/logs"
          className="block px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Comment Logs
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="mt-8 w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 rounded transition flex items-center justify-center gap-2"
      >
        {isLoggingOut ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Logging out...
          </>
        ) : (
          'Logout'
        )}
      </button>
    </aside>
  );
}

