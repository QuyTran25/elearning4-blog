import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogById, updateBlog } from '../../../shared/services/blog.service';
import BlogForm from '../components/BlogForm';

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load bài viết cũ
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await getBlogById(id);
        if (res && res.success) {
          setBlog(res.data);
        } else {
          setError('Không tìm thấy bài viết');
        }
      } catch (err) {
        setError('Có lỗi khi tải bài viết');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      const res = await updateBlog(id, payload);
      if (res.success) {
        alert('Bài viết đã được cập nhật thành công!');
        navigate(`/blog/${id}`);
      } else {
        alert('Lỗi: ' + (res.message || 'Không thể cập nhật bài viết'));
      }
    } catch (error) {
      const errMsg = error.response?.data?.message
        || (error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : null)
        || 'Có lỗi xảy ra khi cập nhật bài viết';
      alert(errMsg);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#1A146B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#F8FAFC] flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 max-w-md mx-auto text-center">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Không thể tải bài viết</h3>
          <p className="text-sm text-slate-500 mb-6">{error}</p>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="px-6 py-2 bg-[#1E1B4B] text-white rounded-lg text-sm font-semibold hover:bg-[#1E1B4B]/90 transition-all"
          >
            Quay về Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Chuẩn bị initial data cho BlogForm
  const initialData = {
    title: blog.title,
    category_id: blog.category_id?.toString() || '',
    content: blog.content,
    image_url: blog.image_url || '',
    tags: blog.tags || '',
  };

  return (
    <BlogForm
      initialData={initialData}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      mode="edit"
    />
  );
}
