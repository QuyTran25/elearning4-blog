import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog, uploadBlogImage } from '../../../shared/services/blog.service';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    content: '',
    image_url: '',
    summary: ''
  });
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories] = useState([
    { id: 1, name: 'Lập trình Web' },
    { id: 2, name: 'Công nghệ phần mềm' },
    { id: 3, name: 'Trí tuệ nhân tạo (AI)' },
    { id: 4, name: 'Phát triển ứng dụng di động' },
    { id: 5, name: 'Bảo mật & An toàn thông tin' },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);

      try {
        const formDataForUpload = new FormData();
        formDataForUpload.append('image', file);
        const res = await uploadBlogImage(formDataForUpload);
        if (res.success) {
          setFormData(prev => ({ ...prev, image_url: res.data.url }));
        }
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.category_id || !formData.content) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createBlog({
        ...formData,
        category_id: parseInt(formData.category_id)
      });
      if (res.success) {
        alert('Bài viết đã được xuất bản thành công!');
        navigate('/');
      } else {
        alert('Lỗi: ' + res.message);
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi xuất bản bài viết');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#F8FAFC]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] shadow-sm">
        <div className="max-w-6xl mx-auto px-10 py-6 flex items-center justify-between">
          <div>
            <h1 className="font-['Inter'] font-bold text-xl text-[#191C1E]">Tạo bài viết mới</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 bg-white border border-[#E2E8F0] text-[#474651] rounded-3xl font-inter font-semibold text-sm hover:bg-[#F8FAFC] transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={() => alert('Lưu nháp chưa được hỗ trợ')}
              className="px-5 py-2.5 bg-white border border-[#E2E8F0] text-[#474651] rounded-3xl font-inter font-semibold text-sm hover:bg-[#F8FAFC] transition-colors"
            >
              Lưu nháp
            </button>
            <button
              onClick={handlePublish}
              disabled={isSubmitting}
              className="px-7 py-2.5 bg-[#1A146B] text-white rounded-3xl font-inter font-semibold text-sm hover:bg-[#0F0B4B] disabled:opacity-50 transition-colors shadow-sm"
            >
              {isSubmitting ? 'Đang xuất bản...' : 'Xuất bản'}
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

          {/* Category & Tags */}
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

            {/* Tags */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6">
              <label className="block font-inter font-bold text-xs text-[#474651] uppercase mb-2">
                Thẻ (Tags)
              </label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-white border border-[#E2E8F0] rounded-2xl px-3 py-1.5 text-xs font-inter font-semibold text-[#474651] flex items-center gap-2"
                  >
                    {tag}
                    <button onClick={() => handleRemoveTag(i)} className="text-[#94A3B8]">✕</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Phân cách bằng dấu phẩy"
                  className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-3 py-1.5 text-xs font-inter focus:outline-none"
                />
                <button
                  onClick={handleAddTag}
                  className="px-3 py-1.5 bg-[#1A146B] text-white text-xs rounded-2xl font-inter font-semibold hover:bg-[#0F0B4B]"
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>

          {/* Summary & Cover */}
          <div className="grid grid-cols-[2fr_1fr] gap-8">
            {/* Summary */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6">
              <label className="block font-inter font-bold text-xs text-[#474651] uppercase mb-2">
                Tóm tắt bài viết
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                placeholder="Viết một đoạn tóm tắt ngắn về nội dung bài viết này (khoảng 150-200 từ)..."
                className="w-full h-32 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 font-inter text-sm text-[#191C1E] placeholder-[#6B7280] focus:outline-none resize-none"
              />
            </div>

            {/* Cover Image */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6">
              <label className="block font-inter font-bold text-xs text-[#474651] uppercase mb-2">
                Ảnh đại diện
              </label>
              <div
                className="bg-[#F8FAFC] border-2 border-dashed border-[#E2E8F0] rounded-2xl p-8 text-center cursor-pointer hover:border-[#1A146B] transition-colors"
                onClick={() => document.getElementById('imageInput').click()}
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
                id="imageInput"
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

            {/* Toolbar */}
            <div className="border-b border-[#E2E8F0] px-4 py-3 flex items-center gap-4 bg-white overflow-x-auto">
              <div className="flex gap-1 border-r border-[#E2E8F0] pr-3">
                <button className="p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors text-[#474651]" title="Bold"><b>B</b></button>
                <button className="p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors text-[#474651]" title="Italic"><i>I</i></button>
                <button className="p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors text-[#474651]" title="Underline"><u>U</u></button>
              </div>
              <div className="flex gap-1 border-r border-[#E2E8F0] pr-3">
                <button className="p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors text-[#474651]" title="UL">≡</button>
                <button className="p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors text-[#474651]" title="OL">1.</button>
              </div>
              <div className="flex gap-1 border-r border-[#E2E8F0] pr-3">
                <button className="p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors text-[#474651]" title="Quote">❝</button>
                <button className="p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors text-[#474651]" title="Code">&lt;&gt;</button>
              </div>
              <button className="p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors text-[#474651]" title="Link">🔗</button>
              <button className="p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors text-[#474651]" title="Image">🖼</button>
            </div>

            {/* Content Textarea */}
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
