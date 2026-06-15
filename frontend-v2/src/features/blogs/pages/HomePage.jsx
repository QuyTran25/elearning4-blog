import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getBlogs, deleteBlog } from '../../../shared/services/blog.service';
import { useAuth } from '../../auth/hooks/useAuth';

export default function HomePage() {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const searchQuery = outletContext?.searchQuery || '';
  const { isAuthenticated, user } = useAuth();
  
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await getBlogs();
        if (res && res.success) {
          setBlogs(res.data || []);
        } else {
          setError('Không thể lấy danh sách bài viết từ máy chủ.');
        }
      } catch (err) {
        console.error(err);
        setError('Có lỗi xảy ra khi kết nối tới máy chủ. Vui lòng kiểm tra lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const getImageUrl = (url) => {
    if (!url) {
      return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop';
    }
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    if (url.startsWith('/')) return url;
    return '/' + url;
  };

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa rõ';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderAvatar = (name) => {
    const initials = name ? name.charAt(0).toUpperCase() : 'U';
    return (
      <div className="w-10 h-10 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#1E1B4B] font-bold text-sm">
        {initials}
      </div>
    );
  };

  // Derive categories dynamically from blogs
  const categories = blogs.reduce((acc, blog) => {
    if (blog.category && !acc.some(cat => cat.id === blog.category.id)) {
      acc.push(blog.category);
    }
    return acc;
  }, []);

  const tabs = [{ id: 'all', name: 'Tất cả' }, ...categories];

  // Filter blogs based on activeTab and searchQuery
  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = activeTab === 'all' || (blog.category && blog.category.id === Number(activeTab));
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (blog.content && blog.content.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Calculate reading time roughly
  const getReadingTime = (content) => {
    if (!content) return '5 min';
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / 200);
    return `${time} min`;
  };

  // Latest blog serves as the Featured Post
  const featuredBlog = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const recentBlogs = filteredBlogs.length > 1 ? filteredBlogs.slice(1) : [];

  if (loading) {
    return (
      <div className="w-full bg-[#F8FAFC] flex-1">
        <div className="max-w-[1280px] mx-auto w-full text-left px-6 sm:px-16 py-12">
          {/* Featured Skeleton */}
          <div className="animate-pulse bg-white rounded-3xl border border-slate-100 p-8 mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-slate-200 h-64 sm:h-80 rounded-2xl"></div>
            <div className="lg:col-span-5 flex flex-col justify-between py-2 gap-4">
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-8 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Cards Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-2xl border border-slate-100 p-4 space-y-4">
                <div className="bg-slate-200 h-48 rounded-xl w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="border-t border-slate-100 pt-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-[#F8FAFC] flex-1">
        <div className="max-w-[1280px] mx-auto w-full text-center px-6 py-20 flex flex-col items-center justify-center">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Không thể tải dữ liệu</h3>
            <p className="text-sm text-slate-500 mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#1E1B4B] text-white rounded-lg text-sm font-semibold hover:bg-[#1E1B4B]/90 transition-all">
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F8FAFC] flex-1">
      <div className="max-w-[1280px] mx-auto w-full text-left px-6 sm:px-16 py-8">
      
      {/* Hero Featured Article Section */}
      {featuredBlog && !searchQuery && activeTab === 'all' && (
        <section className="mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Side Large Image */}
          <div className="lg:col-span-7 aspect-[16/10] bg-[#E2E8F0] rounded-2xl overflow-hidden relative shadow-sm">
            <img 
              src={getImageUrl(featuredBlog.image_url)} 
              alt={featuredBlog.title} 
              onError={handleImageError}
              className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700 ease-out cursor-pointer"
              onClick={() => navigate(`/blog/${featuredBlog.id}`)}
            />
          </div>

          {/* Right Side Details Container */}
          <div className="lg:col-span-5 flex flex-col justify-between py-2 gap-6">
            <div className="space-y-4">
              {/* Tags Badges */}
              <div className="flex items-center gap-3">
                <span className="bg-[#EEF2FF] text-[#4338CA] font-sans font-semibold text-xs tracking-[0.6px] uppercase px-3 py-1 rounded-md">
                  FEATURED
                </span>
                <span className="bg-[#F1F5F9] text-[#475569] font-sans font-semibold text-xs tracking-[0.6px] uppercase px-3 py-1 rounded-md">
                  {featuredBlog.category?.name || 'TECHNOLOGY'}
                </span>
              </div>

              {/* Title Heading 1 */}
              <h1 
                onClick={() => navigate(`/blog/${featuredBlog.id}`)}
                className="font-serif font-bold text-4xl text-[#0F172A] leading-[50px] tracking-tight hover:text-[#1E1B4B] transition-colors duration-300 cursor-pointer"
              >
                {featuredBlog.title}
              </h1>

              {/* Description Excerpt */}
              <p className="font-sans font-normal text-lg leading-[31px] text-[#475569] line-clamp-3">
                {featuredBlog.content?.replace(/[#*`]/g, '') || ''}
              </p>
            </div>

            {/* Author row */}
            <div className="flex items-center gap-4">
              {renderAvatar(featuredBlog.author?.name)}
              <div className="flex flex-col">
                <span className="font-sans font-semibold text-sm text-[#0F172A]">
                  {featuredBlog.author?.name || 'Tác giả'}
                </span>
                <span className="font-sans font-medium text-xs text-[#475569]">
                  {formatDate(featuredBlog.created_at)} • {getReadingTime(featuredBlog.content)} read
                </span>
              </div>
            </div>

            {/* Read Full Article Button */}
            <div>
              <button 
                onClick={() => navigate(`/blog/${featuredBlog.id}`)}
                className="inline-flex items-center gap-2 bg-[#1E1B4B] hover:bg-[#1E1B4B]/95 text-white font-sans font-semibold text-sm px-8 py-3 rounded-full transition-all duration-300 shadow-sm"
              >
                Read Full Article
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Categories Filter Tabs (Integrated inline beautifully) */}
      <div className="mb-10 flex flex-wrap gap-2 items-center border-b border-slate-200/60 pb-3">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id.toString())}
            className={`px-4 py-2 rounded-full text-xs font-sans font-semibold transition-all duration-300 ${
              activeTab === tab.id.toString()
                ? 'bg-[#1E1B4B] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-[#475569] hover:bg-slate-50'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Latest Articles Header Container */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-8">
        <h2 className="font-serif font-bold text-3xl text-[#0F172A]">
          Latest Articles
        </h2>

        {/* Display Toggles */}
        <div className="bg-[#F1F5F9] p-1 rounded-xl flex items-center gap-1">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] text-[#1E1B4B]' : 'text-[#475569] hover:text-[#1E1B4B]'}`}
            title="Grid View"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] text-[#1E1B4B]' : 'text-[#475569] hover:text-[#1E1B4B]'}`}
            title="List View"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Grid or List of Articles */}
      {filteredBlogs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 py-16 px-4 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h4 className="text-[#0F172A] font-bold text-lg">Không tìm thấy bài viết nào</h4>
          <p className="text-slate-400 text-sm mt-1">Vui lòng thử từ khóa khác hoặc chuyển danh mục.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Layout (3 columns) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {(searchQuery || activeTab !== 'all' ? filteredBlogs : [
            ...(featuredBlog ? [] : [featuredBlog]), // prevent duplicate
            ...recentBlogs
          ]).map(blog => (
            <article 
              key={blog.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#F1F5F9] shadow-[0px_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_-1px_rgba(0,0,0,0.1)] hover:shadow-[0_16px_36px_rgba(26,20,107,0.06)] hover:-translate-y-1 transition-all duration-300 group flex flex-col h-[350px]"
            >
              {/* Image Container with Tag Overlay and Admin Actions */}
              <div className="w-full h-[145px] overflow-hidden relative cursor-pointer"
                onClick={() => navigate(`/blog/${blog.id}`)}
              >
                <img 
                  src={getImageUrl(blog.image_url)} 
                  alt={blog.title} 
                  onError={handleImageError}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                {/* Category tag overlay */}
                <div className="absolute left-3 top-3 bg-white/90 backdrop-blur-[4px] px-2 py-1 rounded-[6px]">
                  <span className="font-sans font-bold text-[10px] text-[#1E1B4B] tracking-[0.5px] uppercase">
                    {blog.category?.name || 'WEB DEV'}
                  </span>
                </div>
                {/* Admin actions overlay - chỉ hiện khi là admin */}
                {isAuthenticated && user?.role === 'admin' && (
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/posts/edit/${blog.id}`);
                      }}
                      className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#1E1B4B] hover:bg-white transition-all shadow-sm"
                      title="Chỉnh sửa"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
                          deleteBlog(blog.id)
                            .then(res => {
                              if (res.success) {
                                setBlogs(prev => prev.filter(b => b.id !== blog.id));
                              } else {
                                alert('Lỗi: ' + (res.message || 'Không thể xóa'));
                              }
                            })
                            .catch(err => alert('Có lỗi khi xóa bài viết'));
                        }
                      }}
                      className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-white transition-all shadow-sm"
                      title="Xóa"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Body Content */}
              <div className="p-6 flex-1 flex flex-col justify-between cursor-pointer"
                onClick={() => navigate(`/blog/${blog.id}`)}
              >
                <div className="space-y-2">
                  {/* Title */}
                  <h3 className="font-serif text-lg font-bold text-[#0F172A] leading-7 group-hover:text-[#1E1B4B] transition-colors duration-300 line-clamp-2">
                    {blog.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="font-sans text-[#475569] text-sm leading-5 line-clamp-2">
                    {blog.content?.replace(/[#*`]/g, '') || ''}
                  </p>
                </div>

                {/* Bottom Row */}
                <div className="border-t border-[#F8FAFC] pt-3 flex items-center justify-between text-xs font-sans font-medium">
                  <span className="text-[#475569] truncate max-w-[150px]">
                    {blog.author?.name || 'Tác giả'}
                  </span>
                  <span className="text-[#94A3B8] whitespace-nowrap">
                    {getReadingTime(blog.content)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* List Layout */
        <div className="flex flex-col gap-6 mb-12">
          {(searchQuery || activeTab !== 'all' ? filteredBlogs : [
            ...(featuredBlog ? [] : [featuredBlog]),
            ...recentBlogs
          ]).map(blog => (
            <article 
              key={blog.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#F1F5F9] shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col md:flex-row gap-6 p-4"
            >
              {/* Left Image */}
              <div className="w-full md:w-64 aspect-[16/10] overflow-hidden rounded-xl relative flex-shrink-0 cursor-pointer"
                onClick={() => navigate(`/blog/${blog.id}`)}
              >
                <img 
                  src={getImageUrl(blog.image_url)} 
                  alt={blog.title} 
                  onError={handleImageError}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                />
                {/* Admin overlay buttons for list view */}
                {isAuthenticated && user?.role === 'admin' && (
                  <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/posts/edit/${blog.id}`);
                      }}
                      className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#1E1B4B] hover:bg-white transition-all shadow-sm"
                      title="Chỉnh sửa"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
                          deleteBlog(blog.id)
                            .then(res => {
                              if (res.success) {
                                setBlogs(prev => prev.filter(b => b.id !== blog.id));
                              } else {
                                alert('Lỗi: ' + (res.message || 'Không thể xóa'));
                              }
                            })
                            .catch(err => alert('Có lỗi khi xóa bài viết'));
                        }
                      }}
                      className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-white transition-all shadow-sm"
                      title="Xóa"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Right Details */}
              <div className="flex-1 flex flex-col justify-between py-1 gap-4 cursor-pointer"
                onClick={() => navigate(`/blog/${blog.id}`)}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#1E1B4B] font-bold text-xs tracking-wider uppercase bg-[#1E1B4B]/5 px-2.5 py-0.5 rounded-md">
                      {blog.category?.name || 'WEB DEV'}
                    </span>
                    <span className="text-slate-300 text-xs">•</span>
                    <span className="text-slate-400 text-xs">{formatDate(blog.created_at)}</span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#0F172A] leading-7 group-hover:text-[#1E1B4B] transition-colors duration-300">
                    {blog.title}
                  </h3>

                  <p className="font-sans text-[#475569] text-sm leading-relaxed line-clamp-2">
                    {blog.content?.replace(/[#*`]/g, '') || ''}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-[#F8FAFC] pt-3 text-xs font-sans font-medium">
                  <span className="text-[#475569]">
                    By {blog.author?.name || 'Tác giả'}
                  </span>
                  <span className="text-[#94A3B8]">
                    {getReadingTime(blog.content)} read
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {filteredBlogs.length > 0 && (
        <div className="flex justify-center mt-12 pb-8">
          <button 
            onClick={() => alert('Đã hiển thị tất cả bài viết.')}
            className="box-sizing-border-box bg-white border border-[#E2E8F0] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#F8FAFC] text-[#1E1B4B] font-sans font-semibold text-sm px-10 py-3 rounded-full transition-all duration-300"
          >
            Load More Articles
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
