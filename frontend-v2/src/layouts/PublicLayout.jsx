import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';

export default function PublicLayout() {
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const navigate = useNavigate();

  // Khi đang kiểm tra auth, không render component con để tránh flicker
  // Nhưng vẫn render layout cho nền mượt
  if (isLoading) {
    return (
      <div className="public-container min-h-screen bg-[#F8FAFC]">
        <header className="box-sizing-border-box h-16 bg-white/80 border-b border-[#E2E8F0] backdrop-blur-[6px] sticky top-0 z-50">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-16 h-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-8">
              <Link to="/" className="font-serif font-extrabold text-2xl text-[#1E1B4B] tracking-tight">
                Tech Blog
              </Link>
            </div>
            <div className="flex items-center gap-6">
              <div className="h-8 w-24 bg-slate-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </header>
        <main className="flex-1 flex flex-col bg-[#F8FAFC]">
          <Outlet context={{ searchQuery, setSearchQuery }} />
        </main>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="public-container min-h-screen bg-[#F8FAFC]">
      {/* TopNavBar */}
      <header className="box-sizing-border-box h-16 bg-white/80 border-b border-[#E2E8F0] backdrop-blur-[6px] sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-16 h-full flex items-center justify-between gap-4">
          
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="font-serif font-extrabold text-2xl text-[#1E1B4B] tracking-tight">
              Tech Blog
            </Link>
            
            <nav className="relative flex items-center h-full">
              <Link 
                to="/" 
                className="font-sans font-semibold text-sm text-[#1E1B4B] tracking-wide relative py-1"
              >
                Home
                {/* Horizontal Underline Indicator */}
                <span className="absolute bottom-[-6px] left-0 right-0 h-[2px] bg-[#1E1B4B] rounded-full"></span>
              </Link>
            </nav>
          </div>

          {/* Search, Vertical Border, and Account */}
          <div className="flex items-center gap-6">
            
            {/* Search Bar Input */}
            <div className="relative w-64 hidden sm:block">
              <input
                type="text"
                placeholder="Search insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-full py-1.5 pl-10 pr-4 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#1E1B4B] focus:border-transparent transition-all text-slate-800 placeholder-slate-400"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Vertical Divider */}
            <div className="h-5 w-[1px] bg-[#E2E8F0] hidden sm:block"></div>

            {/* Auth buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Admin badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1E1B4B]/5 rounded-full">
                  <div className="w-5 h-5 bg-[#1E1B4B] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <span className="font-sans font-semibold text-xs text-[#1E1B4B] hidden sm:inline">
                    {user?.name || 'Admin'}
                  </span>
                </div>
                <Link 
                  to="/admin/dashboard" 
                  className="font-sans font-semibold text-sm text-[#1E1B4B] hover:text-[#1E1B4B]/80 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="font-sans font-semibold text-sm text-[#94A3B8] hover:text-red-500 transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link 
                to="/admin/login" 
                className="font-sans font-semibold text-sm text-[#475569] hover:text-[#1E1B4B] transition-colors"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-[#F8FAFC]">
        {/* Pass searchQuery and setSearchQuery to child components */}
        <Outlet context={{ searchQuery, setSearchQuery }} />
      </main>

      {/* Footer */}
      <footer className="box-sizing-border-box bg-[#F7F9FB] border-t border-[#E2E8F0]">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-16 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="font-sans font-extrabold text-base text-[#1A146B] tracking-tight">
            Tech Blog
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-[#474651] font-normal">
            <Link to="/" className="hover:text-[#1E1B4B] transition-colors">About</Link>
            <Link to="/" className="hover:text-[#1E1B4B] transition-colors">Categories</Link>
            <Link to="/" className="hover:text-[#1E1B4B] transition-colors">Contact</Link>
            <Link to="/" className="hover:text-[#1E1B4B] transition-colors">Privacy</Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-slate-400 font-sans font-normal">
            &copy; 2024 Tech Blog. Excellence in Engineering.
          </div>
        </div>
      </footer>
    </div>
  );
}
