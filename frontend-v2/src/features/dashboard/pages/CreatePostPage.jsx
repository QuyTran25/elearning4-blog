import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog } from '../../../shared/services/blog.service';
import BlogForm from '../components/BlogForm';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      const res = await createBlog(payload);
      if (res.success) {
        alert('Bài viết đã được xuất bản thành công!');
        navigate('/');
      } else {
        alert('Lỗi: ' + (res.message || 'Không thể tạo bài viết'));
      }
    } catch (error) {
      const errMsg = error.response?.data?.message
        || (error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : null)
        || 'Có lỗi xảy ra khi xuất bản bài viết';
      alert(errMsg);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BlogForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      mode="create"
    />
  );
}
