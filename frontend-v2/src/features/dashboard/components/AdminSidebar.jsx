import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-72 bg-white border-r border-[#E2E8F0] min-h-screen flex flex-col" style={{ width: '288px' }}>
      {/* Header */}
      <div className="px-8 py-8 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[rgba(26,20,107,0.05)] rounded-3xl flex items-center justify-center">
            <div className="w-5 h-5 bg-[#1A146B]" />
          </div>
          <h1 className="font-inter font-black text-xl text-[#1A146B]">Admin Portal</h1>
        </div>
        <p className="font-inter font-normal text-base text-[#474651] uppercase">Core Management</p>
        <Link
          to="/"
          target="_blank"
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#1A146B] transition-colors"
          title="Xem trang chủ"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay về trang chủ
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <Link
          to="/admin/posts/create"
          className={`flex items-center gap-3 px-4 py-3 rounded-3xl transition-all duration-200 font-inter font-bold text-sm ${
            isActive('/admin/posts/create')
              ? 'bg-[rgba(26,20,107,0.05)] text-[#1A146B]'
              : 'text-[#474651] hover:bg-[#F8FAFC]'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 5a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H6a1 1 0 110-2h4V6a1 1 0 011-1z" />
          </svg>
          Post Management
        </Link>

        <Link
          to="/admin/logs"
          className={`flex items-center gap-3 px-4 py-3 rounded-3xl transition-all duration-200 font-inter font-bold text-sm ${
            isActive('/admin/logs')
              ? 'bg-[rgba(26,20,107,0.05)] text-[#1A146B]'
              : 'text-[#474651] hover:bg-[#F8FAFC]'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
          </svg>
          Comment Logs
        </Link>
      </nav>

      {/* Footer - Admin Card */}
      <div className="px-6 py-6 border-t border-[#E2E8F0]">
        <div className="bg-[#F8FAFC] rounded-4xl p-2 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A146B] to-[#0F172A] flex items-center justify-center text-white font-inter font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-inter font-bold text-sm text-[#191C1E] truncate">
              {user?.name || 'Administrator'}
            </p>
            <p className="font-inter font-medium text-xs text-[#474651] uppercase">
              {user?.role || 'Admin'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="p-1.5 hover:bg-white rounded-lg transition-colors text-[#474651] hover:text-[#1A146B]"
            title="Logout"
          >
            {isLoggingOut ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
