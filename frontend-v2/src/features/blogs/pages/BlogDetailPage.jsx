import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBlogById, getBlogs } from '../../../shared/services/blog.service';

export default function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Comments state
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Lê Văn Duy',
      avatarInitials: 'D',
      time: '1 giờ trước',
      sentiment: 'positive', // positive, neutral
      content: 'Bài viết rất chi tiết và có tính ứng dụng cao. Phần cấu hình Resource Quotas đúng là "nỗi đau" của nhiều team hiện nay. Cảm ơn tác giả!',
      likes: 12,
      replies: 2
    },
    {
      id: 2,
      author: 'Trần Anh Nam',
      avatarInitials: 'N',
      time: '4 giờ trước',
      sentiment: 'neutral',
      content: 'Cho mình hỏi thêm về việc monitor CPU Throttling, bạn thường dùng tool gì ngoài Prometheus không?',
      likes: 4,
      replies: 0
    }
  ]);
  
  const [newComment, setNewComment] = useState('');
  const [likesCount, setLikesCount] = useState(1204);
  const [hasLiked, setHasLiked] = useState(false);

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch current blog details
        const res = await getBlogById(id);
        if (res && res.success) {
          setBlog(res.data);
          
          // Fetch all blogs to filter for related posts
          const listRes = await getBlogs();
          if (listRes && listRes.success) {
            const list = listRes.data || [];
            // Filter out current blog and take up to 3 posts
            const related = list.filter(item => item.id !== Number(id)).slice(0, 3);
            setRelatedBlogs(related);
          }
        } else {
          setError('Không tìm thấy bài viết này.');
        }
      } catch (err) {
        console.error(err);
        setError('Có lỗi xảy ra khi tải bài viết.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [id]);

  const getImageUrl = (url) => {
    if (!url) {
      return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop';
    }
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return '/' + url;
  };

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa rõ';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderAvatar = (name, bgClass = 'bg-[#1A146B]/5 text-[#1A146B]', sizeClass = 'w-10 h-10') => {
    const initials = name ? name.charAt(0).toUpperCase() : 'U';
    return (
      <div className={`${sizeClass} rounded-full ${bgClass} border border-slate-200/50 flex items-center justify-center font-bold font-sans text-sm`}>
        {initials}
      </div>
    );
  };

  const handleLike = () => {
    if (hasLiked) {
      setLikesCount(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikesCount(prev => prev + 1);
      setHasLiked(true);
    }
  };

  // Simple client-side sentiment classifier helper
  const classifySentiment = (text) => {
    const positiveWords = ['hay', 'tốt', 'cảm ơn', 'tuyệt', 'chi tiết', 'hữu ích', 'like', 'yêu thích', 'thanks', 'great', 'useful'];
    const lower = text.toLowerCase();
    const isPositive = positiveWords.some(word => lower.includes(word));
    return isPositive ? 'positive' : 'neutral';
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const sentiment = classifySentiment(newComment);
    const addedComment = {
      id: Date.now(),
      author: 'Khách',
      avatarInitials: 'K',
      time: 'Vừa xong',
      sentiment: sentiment,
      content: newComment,
      likes: 0,
      replies: 0
    };

    setComments(prev => [addedComment, ...prev]);
    setNewComment('');
  };

  // Intelligent content formatter
  const renderContent = (content) => {
    if (!content) return null;
    const lines = content.split('\n');
    let inCodeBlock = false;
    let codeLines = [];
    const renderedElements = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          renderedElements.push(
            <pre key={`code-${i}`} className="bg-[#2D3133]/95 border border-slate-700/20 rounded-2xl p-6 text-[#C3C0FF] font-mono text-sm overflow-x-auto my-6 whitespace-pre">
              <code>{codeLines.join('\n')}</code>
            </pre>
          );
          codeLines = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(lines[i]);
        continue;
      }

      // Check subheadings (e.g., "1. " or "2. ")
      if (/^\d+\.\s+/.test(line)) {
        renderedElements.push(
          <h2 key={`h2-${i}`} className="font-serif text-2xl lg:text-3xl font-extrabold text-[#1A146B] mt-8 mb-4">
            {line}
          </h2>
        );
        continue;
      }

      // Check YAML-style config blocks (no backticks but indentations)
      if (line === 'resources:' || line.startsWith('requests:') || line.startsWith('limits:')) {
        codeLines.push(lines[i]);
        inCodeBlock = true;
        continue;
      }

      // List items
      if (line.startsWith('- ')) {
        renderedElements.push(
          <ul key={`ul-${i}`} className="list-disc pl-6 my-4 text-slate-600 space-y-1 font-sans">
            <li>{line.substring(2)}</li>
          </ul>
        );
        continue;
      }

      // Regular paragraphs
      if (line) {
        const isIntro = renderedElements.length === 0;
        renderedElements.push(
          <p key={`p-${i}`} className={`font-sans text-slate-800 leading-relaxed mb-6 ${
            isIntro ? 'text-lg lg:text-xl text-[#191C1E]/90 font-medium border-l-4 border-[#1A146B] pl-4 py-1' : 'text-base lg:text-lg'
          }`}>
            {line}
          </p>
        );
      }
    }

    // Flush remaining code block
    if (codeLines.length > 0) {
      renderedElements.push(
        <pre key="code-end" className="bg-[#2D3133]/95 border border-slate-700/20 rounded-2xl p-6 text-[#C3C0FF] font-mono text-sm overflow-x-auto my-6 whitespace-pre">
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
    }

    return renderedElements;
  };

  if (loading) {
    return (
      <div className="w-full bg-[#F7F9FB] flex-grow">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-16 py-12 text-left animate-pulse">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-[780px] w-full space-y-6">
              <div className="h-4 bg-slate-200 rounded w-1/6"></div>
              <div className="h-12 bg-slate-200 rounded w-3/4"></div>
              <div className="h-6 bg-slate-200 rounded w-full"></div>
              <div className="h-80 bg-slate-200 rounded w-full"></div>
            </div>
            <div className="lg:w-[340px] w-full space-y-6">
              <div className="h-6 bg-slate-200 rounded w-1/2"></div>
              <div className="h-40 bg-slate-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="w-full bg-[#F7F9FB] flex-grow">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-16 py-20 text-center flex flex-col items-center justify-center">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Không tìm thấy bài viết</h3>
            <p className="text-sm text-slate-500 mb-6">{error || 'Bài viết có thể đã bị xóa hoặc không tồn tại.'}</p>
            <Link to="/" className="px-6 py-2 bg-[#1A146B] text-white rounded-lg text-sm font-semibold hover:bg-[#1A146B]/90 transition-all inline-block">
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F7F9FB] flex-grow">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-16 py-12 text-left">
        {/* Editorial Content Layout */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
        
        {/* Left Side: Article details & content (780px wide) */}
        <article className="lg:w-[780px] w-full bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
          {/* Article Header */}
          <header className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-[#1A146B]/5 text-[#1A146B] font-bold text-xs tracking-wider uppercase rounded-full px-3.5 py-1">
                {blog.category?.name || 'Công nghệ'}
              </span>
              <span className="text-slate-300 text-xs">•</span>
              <span className="text-slate-400 text-xs font-semibold">{formatDate(blog.created_at)}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A146B] leading-tight tracking-tight">
              {blog.title}
            </h1>

            {/* Author details card */}
            <div className="border-y border-slate-200/60 py-4 my-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {renderAvatar(blog.author?.name, 'bg-[#1A146B]/5 text-[#1A146B]', 'w-12 h-12')}
                <div>
                  <p className="text-base font-bold text-[#191C1E]">{blog.author?.name || 'Tác giả'}</p>
                  <p className="text-xs text-slate-400">Đăng ngày {formatDate(blog.created_at)}</p>
                </div>
              </div>

              {/* Action buttons (Share / Bookmark) */}
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-[#474651] hover:bg-slate-50 transition-colors shadow-sm" title="Chia sẻ">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.622-2.312m0 0a3 3 0 11.268-1.742l-4.622 2.312m0 0a3 3 0 11-.268 1.742m0 0a3 3 0 11-4.622-2.312" />
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-[#474651] hover:bg-slate-50 transition-colors shadow-sm" title="Lưu bài viết">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* Article main Image */}
          <div className="w-full aspect-[16/9] overflow-hidden rounded-2xl mb-8 relative">
            <img 
              src={getImageUrl(blog.image_url)} 
              alt={blog.title} 
              onError={handleImageError}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
          </div>

          {/* Article Main Body Content */}
          <div className="prose max-w-none text-[#191C1E] leading-relaxed">
            {renderContent(blog.content)}
          </div>

          {/* Article Likes & Tags row */}
          <div className="border-t border-slate-200/60 pt-6 mt-8 flex flex-wrap items-center justify-between gap-4">
            {/* Interactive Likes button */}
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all shadow-sm ${
                hasLiked 
                  ? 'bg-[#1A146B] text-white shadow-[#1A146B]/25 scale-105' 
                  : 'bg-[#1A146B]/5 text-[#1A146B] hover:bg-[#1A146B]/10'
              }`}
            >
              <svg className="w-5 h-5" fill={hasLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{likesCount.toLocaleString()} thích</span>
            </button>

            {/* Static styling tags matching UI design */}
            <div className="flex gap-2">
              <span className="bg-[#ECEEF0] text-[#474651] rounded-full px-4 py-1.5 text-xs font-semibold hover:bg-slate-200/80 cursor-pointer transition-colors shadow-sm">
                #kubernetes
              </span>
              <span className="bg-[#ECEEF0] text-[#474651] rounded-full px-4 py-1.5 text-xs font-semibold hover:bg-slate-200/80 cursor-pointer transition-colors shadow-sm">
                #devops
              </span>
              <span className="bg-[#ECEEF0] text-[#474651] rounded-full px-4 py-1.5 text-xs font-semibold hover:bg-slate-200/80 cursor-pointer transition-colors shadow-sm">
                #scaling
              </span>
            </div>
          </div>

          {/* Comments Section (Ready-for-Moderation AI sentiment logic) */}
          <div className="mt-12 space-y-8">
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-2xl lg:text-3xl font-extrabold text-[#1A146B]">Bình luận</h3>
              <span className="font-serif text-2xl lg:text-3xl text-slate-300">({comments.length})</span>
            </div>

            {/* Comment Submit Form */}
            <form onSubmit={handleCommentSubmit} className="bg-[#F2F4F6] border border-slate-100 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-start gap-4">
                {renderAvatar('Khách', 'bg-[#C3C0FF] text-white', 'w-10 h-10')}
                <div className="flex-1">
                  <textarea
                    rows="3"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Chia sẻ ý kiến của bạn về bài viết này..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1A146B] focus:border-transparent transition-all shadow-inner"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-6 py-2.5 bg-[#1A146B] text-white rounded-lg text-sm font-bold shadow-md shadow-[#1A146B]/10 hover:bg-[#1A146B]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Gửi bình luận
                </button>
              </div>
            </form>

            {/* Comments list with sentiment classification */}
            <div className="space-y-4 pt-2">
              {comments.map(c => (
                <div key={c.id} className="bg-[#F2F4F6]/50 border border-slate-200/40 rounded-2xl p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {renderAvatar(c.author, 'bg-slate-200 text-slate-700', 'w-10 h-10')}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-[#191C1E]">{c.author}</p>
                          {/* Sentiment Tag */}
                          {c.sentiment === 'positive' ? (
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-emerald-200/60 bg-emerald-50 text-emerald-700 tracking-wider">
                              Tích cực
                            </span>
                          ) : (
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-slate-200 bg-slate-100 text-slate-500 tracking-wider">
                              Trung lập
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{c.time}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed pl-13">
                    {c.content}
                  </p>

                  <div className="flex items-center gap-4 pl-13 text-xs text-slate-400 font-semibold">
                    <button className="flex items-center gap-1 hover:text-[#1A146B] transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.757a2.243 2.243 0 012.243 2.243v3.89c0 .445-.252.85-.656 1.053l-3 1.51a2.243 2.243 0 01-1.053.268H14M8.684 10.742l4.622-2.312m0 0a3 3 0 11.268-1.742l-4.622 2.312m0 0a3 3 0 11-.268 1.742m0 0a3 3 0 11-4.622-2.312" />
                      </svg>
                      <span>Thích ({c.likes})</span>
                    </button>
                    <span>•</span>
                    <button className="hover:text-[#1A146B] transition-colors">
                      Trả lời
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* Right Side: Related posts sidebar (340px wide) */}
        <aside className="lg:w-[340px] w-full space-y-6 lg:sticky lg:top-8">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
            <div className="w-1.5 h-6 bg-[#1A146B] rounded-full"></div>
            <h4 className="font-sans font-extrabold text-[#1A146B] text-xl">Bài viết liên quan</h4>
          </div>

          <div className="space-y-6">
            {relatedBlogs.map(rBlog => (
              <div 
                key={rBlog.id}
                onClick={() => navigate(`/blog/${rBlog.id}`)}
                className="group cursor-pointer bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-[0_12px_24px_rgba(26,20,107,0.04)] transition-all duration-300 flex flex-col"
              >
                <div className="w-full aspect-[16/10] overflow-hidden relative">
                  <img 
                    src={getImageUrl(rBlog.image_url)} 
                    alt={rBlog.title} 
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
                
                <div className="p-4 space-y-2">
                  <h5 className="font-sans font-bold text-sm text-[#191C1E] line-clamp-2 leading-snug group-hover:text-[#1A146B] transition-colors duration-300">
                    {rBlog.title}
                  </h5>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{formatDate(rBlog.created_at)}</span>
                    <span>•</span>
                    <span>10 phút đọc</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

      </div>
      </div>
    </div>
  );
}
