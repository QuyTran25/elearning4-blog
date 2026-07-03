import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBlogById, getBlogs, deleteBlog, toggleLike } from '../../../shared/services/blog.service';
import commentService from '../../../shared/services/comment.service';
import { useAuth } from '../../auth/hooks/useAuth';

export default function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Comments state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  // Moderation modal state
  const [showModModal, setShowModModal] = useState(false);
  const [modData, setModData] = useState(null);

  // Reply state (admin only)
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [id]);

  useEffect(() => {
    if (!window.location.hash || comments.length === 0) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(window.location.hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-2', 'ring-[#1A146B]', 'ring-offset-2', 'transition-all');
        setTimeout(() => el.classList.remove('ring-2', 'ring-[#1A146B]', 'ring-offset-2'), 3000);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [comments]);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = {};
        const guestToken = localStorage.getItem('guest_token');
        if (guestToken) params.guest_token = guestToken;
        const res = await getBlogById(id, params);
        if (res && res.success) {
          setBlog(res.data);
          setLikesCount(res.data.likes || 0);
          setHasLiked(res.data.liked || false);
          const listRes = await getBlogs();
          if (listRes && listRes.success) {
            const list = listRes.data || [];
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

  useEffect(() => {
    if (!blog) return;
    const fetchComments = async () => {
      try {
        setCommentsLoading(true);
        const res = await commentService.getComments(blog.id);
        if (res && res.success) {
          const mapped = (res.data || []).map(c => ({
            id: c.id,
            author: c.author_name || 'Khách',
            time: formatCommentTime(c.created_at),
            content: c.displayed_text || c.content,
            replies: c.replies || [],
            status: c.status,
            blog_id: c.blog_id,
            is_admin_reply: c.is_admin_reply,
            mlp_label: c.mlp_label,
            mlp_confidence: c.mlp_confidence,
            bad_words: c.bad_words,
          }));
          setComments(mapped);
        } else {
          setCommentsError('Không thể tải bình luận');
        }
      } catch (err) {
        console.error(err);
        setCommentsError('Có lỗi khi tải bình luận');
      } finally {
        setCommentsLoading(false);
      }
    };
    fetchComments();
  }, [blog]);

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop';
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
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatCommentTime = (dateString) => {
    if (!dateString) return 'Vừa xong';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const renderAvatar = (name, bgClass = 'bg-[#1A146B]/5 text-[#1A146B]', sizeClass = 'w-10 h-10') => {
    const initials = name ? name.charAt(0).toUpperCase() : 'U';
    return (
      <div className={`${sizeClass} rounded-full ${bgClass} border border-slate-200/50 flex items-center justify-center font-bold font-sans text-sm`}>
        {initials}
      </div>
    );
  };

  // ---- LIKE ----
  const getGuestToken = () => {
    let token = localStorage.getItem('guest_token');
    if (!token) {
      token = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('guest_token', token);
    }
    return token;
  };

  const handleLike = async () => {
    try {
      const payload = {};
      if (!isAuthenticated) {
        payload.guest_token = getGuestToken();
      }
      const res = await toggleLike(blog.id, payload);
      if (res.success) {
        setHasLiked(res.liked);
        setLikesCount(res.likes);
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  // ---- COMMENT SUBMIT ----
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await commentService.createComment(blog.id, {
        author_name: user?.name || 'Khách',
        content: newComment,
      });
      if (res && res.success) {
        if (res.action === 'SUGGEST_STRICT') {
          setModData(res);
          setShowModModal(true);
        } else {
          const newCommentObj = {
            id: res.comment_id,
            author: user?.name || 'Khách',
            time: 'Vừa xong',
            content: res.censored_text || newComment,
            replies: [],
            likes: 0,
            status: res.status,
            mlp_label: res.data?.mlp_label,
            mlp_confidence: res.data?.mlp_confidence,
            bad_words: res.data?.bad_words
          };
          setComments(prev => [newCommentObj, ...prev]);
          setNewComment('');
        }
      } else {
        alert('Lỗi: ' + (res?.message || 'Không thể gửi bình luận'));
      }
    } catch (error) {
      const errMsg = error.response?.data?.message
        || (error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : null)
        || 'Có lỗi xảy ra khi gửi bình luận';
      alert(errMsg);
    }
  };

  // ---- MODERATION CONFIRM ----
  const handleModerationConfirm = async (choice) => {
    try {
      const res = await commentService.confirmPost(blog.id, {
        comment_id: modData.comment_id,
        username: user?.name || 'Khách',
        user_choice: choice,
        new_text: choice === 'y' ? modData.smart_text : null
      });
      if (res.success) {
        if (choice === 'y') {
          const newCommentObj = {
            id: modData.comment_id,
            author: user?.name || 'Khách',
            time: 'Vừa xong',
            content: modData.smart_text,
            replies: [],
            likes: 0,
            status: 'posted_smart',
            mlp_label: modData.mlp_label || 'Toxic',
            mlp_confidence: modData.mlp_confidence || 1.0,
            bad_words: modData.bad_words || []
          };
          setComments(prev => [newCommentObj, ...prev]);
          alert('Bình luận đã được đăng với nội dung chỉnh sửa.');
        } else {
          alert('Bình luận đã bị hủy bỏ do vi phạm.');
        }
        setNewComment('');
      }
    } catch (error) {
      alert('Có lỗi khi xử lý quyết định của bạn.');
    } finally {
      setShowModModal(false);
      setModData(null);
    }
  };

  // ---- DELETE COMMENT (ADMIN) ----
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;
    try {
      const res = await commentService.deleteComment(commentId);
      if (res.success) {
        setComments(prev => prev.filter(c => c.id !== commentId));
        alert('Đã xóa bình luận thành công!');
      } else {
        alert('Lỗi: ' + res.message);
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi xóa bình luận.');
    }
  };

  // ---- REPLY (ADMIN) ----
  const handleReply = async (commentId) => {
    if (!replyText.trim()) return;
    try {
      const res = await commentService.replyComment(commentId, replyText);
      if (res.success) {
        setComments(prev => prev.map(c => {
          if (c.id === commentId) {
            return { ...c, replies: [...(c.replies || []), res.data] };
          }
          return c;
        }));
        setReplyText('');
        setReplyingTo(null);
      }
    } catch (error) {
      alert('Có lỗi khi trả lời bình luận.');
    }
  };

  // ---- RENDER CONTENT ----
  const renderContent = (content) => {
    if (!content) return null;
    const lines = content.split('\n');
    let inCodeBlock = false;
    let codeLines = [];
    const renderedElements = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          renderedElements.push(<pre key={`code-${i}`} className="bg-[#2D3133]/95 border border-slate-700/20 rounded-2xl p-6 text-[#C3C0FF] font-mono text-sm overflow-x-auto my-6 whitespace-pre"><code>{codeLines.join('\n')}</code></pre>);
          codeLines = [];
          inCodeBlock = false;
        } else { inCodeBlock = true; }
        continue;
      }
      if (inCodeBlock) { codeLines.push(lines[i]); continue; }
      if (/^\d+\.\s+/.test(line)) {
        renderedElements.push(<h2 key={`h2-${i}`} className="font-serif text-2xl lg:text-3xl font-extrabold text-[#1A146B] mt-8 mb-4">{line}</h2>);
        continue;
      }
      if (line === 'resources:' || line.startsWith('requests:') || line.startsWith('limits:')) {
        codeLines.push(lines[i]); inCodeBlock = true; continue;
      }
      if (line.startsWith('- ')) {
        renderedElements.push(<ul key={`ul-${i}`} className="list-disc pl-6 my-4 text-slate-600 space-y-1 font-sans"><li>{line.substring(2)}</li></ul>);
        continue;
      }
      if (line) {
        const isIntro = renderedElements.length === 0;
        renderedElements.push(<p key={`p-${i}`} className={`font-sans text-slate-800 leading-relaxed mb-6 ${isIntro ? 'text-lg lg:text-xl text-[#191C1E]/90 font-medium border-l-4 border-[#1A146B] pl-4 py-1' : 'text-base lg:text-lg'}`}>{line}</p>);
      }
    }
    if (codeLines.length > 0) {
      renderedElements.push(<pre key="code-end" className="bg-[#2D3133]/95 border border-slate-700/20 rounded-2xl p-6 text-[#C3C0FF] font-mono text-sm overflow-x-auto my-6 whitespace-pre"><code>{codeLines.join('\n')}</code></pre>);
    }
    return renderedElements;
  };

  // ---- LOADING / ERROR STATES ----
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
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Không tìm thấy bài viết</h3>
            <p className="text-sm text-slate-500 mb-6">{error || 'Bài viết có thể đã bị xóa hoặc không tồn tại.'}</p>
            <Link to="/" className="px-6 py-2 bg-[#1A146B] text-white rounded-lg text-sm font-semibold hover:bg-[#1A146B]/90 transition-all inline-block">Quay về trang chủ</Link>
          </div>
        </div>
      </div>
    );
  }

  // ---- MAIN RENDER ----
  return (
    <div className="w-full bg-[#F7F9FB] flex-grow">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-16 py-12 text-left">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Article */}
          <article className="lg:w-[780px] w-full bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
            <header className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-[#1A146B]/5 text-[#1A146B] font-bold text-xs tracking-wider uppercase rounded-full px-3.5 py-1">{blog.category?.name || 'Công nghệ'}</span>
                <span className="text-slate-300 text-xs">•</span>
                <span className="text-slate-400 text-xs font-semibold">{formatDate(blog.created_at)}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A146B] leading-tight tracking-tight">{blog.title}</h1>
              <div className="border-y border-slate-200/60 py-4 my-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {renderAvatar(blog.author?.name, 'bg-[#1A146B]/5 text-[#1A146B]', 'w-12 h-12')}
                  <div>
                    <p className="text-base font-bold text-[#191C1E]">{blog.author?.name || 'Tác giả'}</p>
                    <p className="text-xs text-slate-400">Đăng ngày {formatDate(blog.created_at)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isAuthenticated && user?.role === 'admin' ? (
                    <>
                      <button onClick={() => navigate(`/admin/posts/edit/${blog.id}`)} className="flex items-center gap-1.5 px-4 py-2 bg-[#1A146B]/5 text-[#1A146B] rounded-full hover:bg-[#1A146B]/10 transition-colors text-xs font-bold" title="Chỉnh sửa">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        <span className="hidden sm:inline">Sửa</span>
                      </button>
                      <button onClick={() => { if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) { deleteBlog(blog.id).then(res => { if (res.success) { alert('Đã xóa bài viết thành công!'); navigate('/'); } else { alert('Lỗi: ' + (res.message || 'Không thể xóa bài viết')); } }).catch(() => alert('Có lỗi khi xóa bài viết')); } }} className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors text-xs font-bold" title="Xóa">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        <span className="hidden sm:inline">Xóa</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-[#474651] hover:bg-slate-50 transition-colors shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.622-2.312m0 0a3 3 0 11.268-1.742l-4.622 2.312m0 0a3 3 0 11-.268 1.742m0 0a3 3 0 11-4.622-2.312" /></svg></button>
                      <button className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-[#474651] hover:bg-slate-50 transition-colors shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg></button>
                    </>
                  )}
                </div>
              </div>
            </header>

            <div className="w-full aspect-[16/9] overflow-hidden rounded-2xl mb-8 relative">
              <img src={getImageUrl(blog.image_url)} alt={blog.title} onError={handleImageError} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>

            <div className="prose max-w-none text-[#191C1E] leading-relaxed">{renderContent(blog.content)}</div>

            {/* LIKE BUTTON */}
            <div className="border-t border-slate-200/60 pt-6 mt-8 flex flex-wrap items-center justify-between gap-4">
              <button onClick={handleLike} className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all shadow-sm ${hasLiked ? 'bg-[#1A146B] text-white shadow-[#1A146B]/25 scale-105' : 'bg-[#1A146B]/5 text-[#1A146B] hover:bg-[#1A146B]/10'}`}>
                <svg className="w-5 h-5" fill={hasLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                <span>{likesCount.toLocaleString()} thích</span>
              </button>
              <div className="flex gap-2 flex-wrap">
                {blog.tags ? blog.tags.split(',').map((tag, i) => (
                  <span key={i} className="bg-[#ECEEF0] text-[#474651] rounded-full px-4 py-1.5 text-xs font-semibold">{tag.trim()}</span>
                )) : null}
              </div>
            </div>

            {/* COMMENTS SECTION */}
            <div className="mt-12 space-y-8">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-2xl lg:text-3xl font-extrabold text-[#1A146B]">Bình luận</h3>
                <span className="font-serif text-2xl lg:text-3xl text-slate-300">({comments.length})</span>
              </div>

              <form onSubmit={handleCommentSubmit} className="bg-[#F2F4F6] border border-slate-100 rounded-2xl p-5 sm:p-6 space-y-4">
                <div className="flex items-start gap-4">
                  {renderAvatar('Khách', 'bg-[#C3C0FF] text-white', 'w-10 h-10')}
                  <div className="flex-1">
                    <textarea rows="3" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Chia sẻ ý kiến của bạn về bài viết này..." className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1A146B] focus:border-transparent transition-all shadow-inner"></textarea>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={!newComment.trim()} className="px-6 py-2.5 bg-[#1A146B] text-white rounded-lg text-sm font-bold shadow-md shadow-[#1A146B]/10 hover:bg-[#1A146B]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Gửi bình luận</button>
                </div>
              </form>

              {/* COMMENTS LIST */}
              <div className="space-y-4 pt-2">
                {comments.map(c => (
                  <div key={c.id} id={`comment-${c.id}`} className="bg-[#F2F4F6]/50 border border-slate-200/40 rounded-2xl p-5 sm:p-6 space-y-4 transition-all duration-500">
                    <div className="flex items-center gap-3">
                      {renderAvatar(c.author, 'bg-slate-200 text-slate-700', 'w-10 h-10')}
                      <div>
                        <p className="text-sm font-bold text-[#191C1E]">{c.author}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{c.time}</p>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed pl-13">{c.content}</p>

                    <div className="flex items-center gap-4 pl-13 text-xs text-slate-400 font-semibold">
                      {isAuthenticated && user?.role === 'admin' && (
                        <>
                          <button onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)} className="hover:text-[#1A146B] transition-colors">Trả lời</button>
                          <span>•</span>
                          <button onClick={() => handleDeleteComment(c.id)} className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Xóa
                          </button>
                        </>
                      )}
                    </div>

                    {/* Reply form for admin */}
                    {replyingTo === c.id && isAuthenticated && user?.role === 'admin' && (
                      <div className="ml-13 bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                        <p className="text-xs font-bold text-slate-500">Trả lời {c.author}:</p>
                        <textarea rows="2" value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Nhập nội dung trả lời..." className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A146B] focus:border-transparent" />
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { setReplyingTo(null); setReplyText(''); }} className="px-4 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors">Hủy</button>
                          <button onClick={() => handleReply(c.id)} disabled={!replyText.trim()} className="px-4 py-1.5 bg-[#1A146B] text-white text-xs font-bold rounded-lg hover:bg-[#1A146B]/90 transition-all disabled:opacity-50">Gửi trả lời</button>
                        </div>
                      </div>
                    )}

                    {/* Nested replies */}
                    {c.replies && c.replies.length > 0 && (
                      <div className="ml-6 sm:ml-10 pl-4 border-l-2 border-[#1A146B]/10 space-y-3">
                        {c.replies.map(reply => (
                          <div key={reply.id} id={`comment-${reply.id}`} className="bg-white/80 rounded-xl p-4 space-y-2">
                            <div className="flex items-center gap-2">
                              {renderAvatar(reply.author_name, reply.is_admin_reply ? 'bg-[#1A146B] text-white' : 'bg-slate-200 text-slate-700', 'w-7 h-7')}
                              <p className="text-xs font-bold text-[#191C1E]">
                                {reply.author_name}
                                {reply.is_admin_reply && <span className="ml-1.5 text-[10px] font-semibold bg-[#1A146B] text-white px-1.5 py-0.5 rounded-full">Admin</span>}
                              </p>
                            </div>
                            <p className="text-slate-600 text-xs leading-relaxed pl-9">{reply.displayed_text || reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-[340px] w-full space-y-6 lg:sticky lg:top-8">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
              <div className="w-1.5 h-6 bg-[#1A146B] rounded-full"></div>
              <h4 className="font-sans font-extrabold text-[#1A146B] text-xl">Bài viết liên quan</h4>
            </div>
            <div className="space-y-6">
              {relatedBlogs.map(rBlog => (
                <div key={rBlog.id} onClick={() => navigate(`/blog/${rBlog.id}`)} className="group cursor-pointer bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-[0_12px_24px_rgba(26,20,107,0.04)] transition-all duration-300 flex flex-col">
                  <div className="w-full aspect-[16/10] overflow-hidden relative">
                    <img src={getImageUrl(rBlog.image_url)} alt={rBlog.title} onError={handleImageError} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                  </div>
                  <div className="p-4 space-y-2">
                    <h5 className="font-sans font-bold text-sm text-[#191C1E] line-clamp-2 leading-snug group-hover:text-[#1A146B] transition-colors duration-300">{rBlog.title}</h5>
                    <div className="flex items-center gap-2 text-xs text-slate-400"><span>{formatDate(rBlog.created_at)}</span><span>•</span><span>10 phút đọc</span></div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      {/* Moderation Modal */}
      {showModModal && modData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-red-100">
            <div className="bg-red-50 p-6 border-b border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-red-900">Phát hiện nội dung nhạy cảm</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-slate-700 text-sm">{modData.message}</p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Nội dung ban đầu của bạn:</p>
                <p className="text-slate-800 line-through opacity-70">{modData.original_text}</p>
              </div>
              {modData.smart_text && (
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Gợi ý chỉnh sửa:</p>
                  <p className="text-emerald-900 font-medium">{modData.smart_text}</p>
                </div>
              )}
              <p className="text-sm text-slate-500 italic mt-2">Bạn có đồng ý sử dụng gợi ý chỉnh sửa này không? Nếu từ chối, bình luận của bạn sẽ bị hủy bỏ và hành vi vi phạm sẽ được ghi nhận.</p>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button onClick={() => handleModerationConfirm('n')} className="px-5 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">Hủy bỏ bình luận</button>
              <button onClick={() => handleModerationConfirm('y')} className="px-5 py-2 bg-[#1A146B] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#1A146B]/90 transition-colors">Đồng ý chỉnh sửa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
