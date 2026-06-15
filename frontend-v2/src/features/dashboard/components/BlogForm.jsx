import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../shared/services/api';

export default function BlogForm({ initialData, onSubmit, isSubmitting, mode = 'create' }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category_id: initialData?.category_id || '',
    content: initialData?.content || '',
    image_url: initialData?.image_url || '',
  });
  const [imagePreview, setImagePreview] = useState(initialData?.image_url ? getFullImageUrl(initialData.image_url) : null);
  const [categories, setCategories] = useState([]);

  function getFullImageUrl(url) {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    if (url.startsWith('/')) return url;
    return '/' + url;
  }

  // Đồng bộ formData khi initialData thay đổi (edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category_id: initialData.category_id || '',
        content: initialData.content || '',
        image_url: initialData.image_url || '',
      });
      setImagePreview(initialData.image_url ? getFullImageUrl(initialData.image_url) : null);
    }
  }, [initialData]);

  // Load categories from API
  useEffect(() => {
    apiClient.get('/categories')
      .then(res => {
        if (res.data?.success) setCategories(res.data.data);
      })
      .catch(() => {
        setCategories([
          { id: 1, name: 'Lập trình Web' },
          { id: 2, name: 'Công nghệ phần mềm' },
          { id: 3, name: 'Trí tuệ nhân tạo (AI)' },
          { id: 4, name: 'Phát triển ứng dụng di động' },
          { id: 5, name: 'Bảo mật & An toàn thông tin' },
          { id: 6, name: 'Kinh nghiệm lập trình viên' },
          { id: 7, name: 'Học tập & Phát triển bản thân' },
        ]);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview immediately
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);
      const res = await apiClient.post('/blogs/upload-image', uploadFormData);
      if (res.data?.success) {
        setFormData(prev => ({ ...prev, image_url: res.data.data.url }));
      } else {
        alert('Upload ảnh thất bại. Bài viết sẽ không có ảnh.');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Lỗi kết nối khi upload ảnh.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category_id || !formData.content) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Tiêu đề, Danh mục, Nội dung)');
      return;
    }
    const payload = {
      title: formData.title,
      content: formData.content,
      category_id: parseInt(formData.category_id),
      image_url: formData.image_url || null,
    };
    onSubmit(payload);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#F8FAFC]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] shadow-sm">
        <div className="max-w-6xl mx-auto px-10 py-6 flex items-center justify-between">
          <div>
            <h1 className="font-['Inter'] font-bold text-xl text-[#191C1E]">
              {mode === 'edit' ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 bg-white border border-[#E2E8F0] text-[#474651] rounded-3xl font-inter font-semibold text-sm hover:bg-[#F8FAFC] transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-7 py-2.5 bg-[#1A146B] text-white rounded-3xl font-inter font-semibold text-sm hover:bg-[#0F0B4B] disabled:opacity-50 transition-colors shadow-sm"
            >
              {isSubmitting
                ? (mode === 'edit' ? 'Đang cập nhật...' : 'Đang xuất bản...')
                : (mode === 'edit' ? 'Cập nhật' : 'Xuất bản')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-10 py-12">
        <div className="space-y-8">
          {/* Title Section */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-10">
            <label className="block font-inter font-bold text-xs text-[#474651] uppercase letter-spacing-wide mb-2">
              Tiêu đề bài viết *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Nhập tiêu đề thu hút người đọc..."
              className="w-full font-['Liberation_Serif'] font-bold text-3xl text-[#191C1E] placeholder-[#CBD5E1] bg-transparent border-b border-[#E2E8F0] pb-3 focus:outline-none"
            />
          </div>

          {/* Category & Image */}
          <div className="grid grid-cols-2 gap-8">
            {/* Category */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6">
              <label className="block font-inter font-bold text-xs text-[#474651] uppercase mb-2">
                Danh mục *
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl px-4 py-3 font-inter text-sm text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#1A146B]"
              >
                <option value="">Chọn danh mục</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Cover Image */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6">
              <label className="block font-inter font-bold text-xs text-[#474651] uppercase mb-2">
                Ảnh đại diện
              </label>
              <div
                className="bg-[#F8FAFC] border-2 border-dashed border-[#E2E8F0] rounded-2xl p-8 text-center cursor-pointer hover:border-[#1A146B] transition-colors"
                onClick={() => document.getElementById('formImageInput').click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="w-full h-24 object-cover rounded-lg" />
                ) : (
                  <div className="space-y-2">
                    <div className="w-6 h-6 bg-[#94A3B8] rounded-lg mx-auto" />
                    <p className="font-inter font-bold text-xs text-[#474651]">Tải ảnh lên</p>
                    <p className="font-inter text-xs text-[#94A3B8]">hoặc kéo thả</p>
                  </div>
                )}
              </div>
              <input
                id="formImageInput"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Editor */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden">
            <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-6 py-4">
              <p className="font-inter font-bold text-xs text-[#474651] uppercase">Nội dung bài viết *</p>
            </div>

            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Bắt đầu viết nội dung tuyệt vời của bạn tại đây..."
              className="w-full h-96 px-6 py-8 font-inter text-sm text-[#191C1E] placeholder-[#CBD5E1] bg-white focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
