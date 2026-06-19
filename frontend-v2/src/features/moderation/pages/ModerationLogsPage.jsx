import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getModerationLogs } from '../../../shared/services/moderation.service';
import commentService from '../../../shared/services/comment.service';

export default function ModerationLogsPage() {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedComment, setSelectedComment] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await getModerationLogs();
      if (res && res.success) {
        setLogs(res.data || []);
      }
    } catch (error) {
      console.error("Failed to load logs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này khỏi hệ thống? Hành động này không thể hoàn tác.')) {
      return;
    }
    try {
      const res = await commentService.deleteComment(id);
      if (res.success) {
        alert('Đã xóa bình luận thành công!');
        fetchLogs();
        if (selectedComment && selectedComment.id === id) {
          setSelectedComment(null);
        }
      } else {
        alert('Lỗi: ' + res.message);
      }
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi xóa bình luận.');
    }
  };

  const typeColors = {
    Clean: { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100' },
    Toxic: { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100' },
    Insult: { bg: 'bg-orange-50', text: 'text-orange-700', badge: 'bg-orange-100' },
    SPAM: { bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-100' },
    THREAT: { bg: 'bg-red-900', text: 'text-red-700', badge: 'bg-red-900' }
  };

  const statusLabels = {
    posted: 'Đã duyệt',
    posted_censored: 'Đã chỉnh sửa',
    posted_smart: 'Đã chỉnh sửa',
    blocked: 'Đã chặn',
    pending_edit: 'Đang xét'
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const filteredLogs = logs.filter(log => {
    const comment = log;
    const matchType = filterType === 'all' || comment.mlp_label === filterType;
    const matchStatus = status === 'all' || 
      (status === 'posted' && (comment.status === 'posted' || comment.status === 'posted_smart' || comment.status === 'posted_censored')) ||
      comment.status === status;
    const matchSearch = searchQuery === '' || 
      (comment.content && comment.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (comment.author_name && comment.author_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchType && matchStatus && matchSearch;
  });

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      {/* Header */}
      <div className="bg-white pt-16 pb-12 px-16 border-b border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 gap-8 items-start mb-8">
            <div>
              <h1 className="font-['Liberation_Serif'] font-bold text-4xl text-[#191C1E] mb-2">
                Logs Bình Luận
              </h1>
              <p className="font-inter font-normal text-base text-[#474651]">
                Kiểm duyệt và theo dõi tất cả hoạt động bình luận trên hệ thống.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={fetchLogs}
                className="flex items-center gap-2 bg-[#1A146B] text-white rounded-2xl px-6 py-3.5 font-inter font-normal text-base hover:bg-[#0F0B4B] transition-colors shadow-sm"
              >
                <span>🔄</span> Làm Mới
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-3 gap-8">
            {/* Type Filter */}
            <div>
              <label className="block font-inter font-normal text-base text-[#474651] mb-2">Phân loại AI</label>
              <select
                value={filterType}
                onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
                className="w-full bg-white border border-[#C8C5D3] rounded-2xl px-4 py-3 font-inter text-base text-[#191C1E] focus:outline-none"
              >
                <option value="all">Tất cả phân loại</option>
                <option value="Clean">Clean</option>
                <option value="Toxic">Toxic</option>
                <option value="Insult">Insult</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block font-inter font-normal text-base text-[#474651] mb-2">Tìm kiếm nhanh</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Nhập nội dung bình luận hoặc tên người dùng..."
                className="w-full bg-white border border-[#C8C5D3] rounded-2xl px-4 py-3 font-inter text-base text-[#191C1E] placeholder-[#6B7280] focus:outline-none"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block font-inter font-normal text-base text-[#474651] mb-2">Trạng thái</label>
              <div className="flex gap-2">
                <button
                  onClick={() => { setStatus('all'); setCurrentPage(1); }}
                  className={`flex-1 px-4 py-2 rounded-lg font-inter text-sm font-medium transition-colors ${
                    status === 'all' ? 'bg-[#1A146B] text-white' : 'bg-white border border-[#C8C5D3] text-[#191C1E]'
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => { setStatus('posted'); setCurrentPage(1); }}
                  className={`flex-1 px-4 py-2 rounded-lg font-inter text-sm font-medium transition-colors ${
                    status === 'posted' ? 'bg-[#1A146B] text-white' : 'bg-white border border-[#C8C5D3] text-[#191C1E]'
                  }`}
                >
                  Đã duyệt
                </button>
                <button
                  onClick={() => { setStatus('blocked'); setCurrentPage(1); }}
                  className={`flex-1 px-4 py-2 rounded-lg font-inter text-sm font-medium transition-colors ${
                    status === 'blocked' ? 'bg-[#1A146B] text-white' : 'bg-white border border-[#C8C5D3] text-[#191C1E]'
                  }`}
                >
                  Đã chặn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-16">
        <div className="max-w-6xl mx-auto bg-white rounded-lg border border-[#E2E8F0] overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-4 text-left font-inter font-bold text-xs text-[#474651] uppercase">Người Dùng</th>
                <th className="px-6 py-4 text-left font-inter font-bold text-xs text-[#474651] uppercase">Nội Dung Gốc</th>
                <th className="px-6 py-4 text-left font-inter font-bold text-xs text-[#474651] uppercase">Nhãn AI</th>
                <th className="px-6 py-4 text-left font-inter font-bold text-xs text-[#474651] uppercase">Trạng Thái</th>
                <th className="px-6 py-4 text-left font-inter font-bold text-xs text-[#474651] uppercase">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : paginatedLogs.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">Không có dữ liệu</td></tr>
              ) : (
                paginatedLogs.map((comment) => {
                  const colors = typeColors[comment.mlp_label] || typeColors.Clean;
                  return (
                    <tr key={comment.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A146B] to-[#0F172A] text-white flex items-center justify-center font-inter font-bold text-sm">
                            {getInitials(comment.author_name)}
                          </div>
                          <div>
                            <p className="font-inter font-semibold text-sm text-[#191C1E]">{comment.author_name || 'Unknown'}</p>
                            <p className="font-inter text-xs text-[#474651]">{new Date(comment.created_at).toLocaleString('vi-VN')}</p>
                          </div>
                        </div>
                      </td>
                      {/* Original Content */}
                      <td className="px-6 py-4">
                        <p className="font-inter text-sm text-slate-800 max-w-[250px] truncate">{comment.content}</p>
                      </td>
                      {/* Type */}
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full font-inter font-bold text-xs ${colors.badge}`}>
                          <span className={colors.text}>{comment.mlp_label}</span>
                        </span>
                      </td>
                      {/* Status Action */}
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-md font-inter text-xs ${
                          comment.status === 'blocked' ? 'bg-red-100 text-red-800' :
                          comment.status === 'posted_smart' || comment.status === 'posted_censored' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {statusLabels[comment.status] || comment.status}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setSelectedComment(comment)}
                            className="font-inter text-sm text-[#1A146B] font-semibold hover:underline"
                          >
                            Xem Chi Tiết
                          </button>
                          <button 
                            onClick={() => handleDelete(comment.id)}
                            className="font-inter text-sm text-red-600 font-semibold hover:underline"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="max-w-6xl mx-auto mt-6 flex items-center justify-between">
          <p className="font-inter text-sm text-[#474651]">
            Hiển thị {filteredLogs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredLogs.length)} của {filteredLogs.length} kết quả
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-inter disabled:opacity-50"
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg font-inter text-sm font-semibold transition-colors ${
                  currentPage === i + 1
                    ? 'bg-[#1A146B] text-white'
                    : 'bg-white border border-[#E2E8F0] text-[#191C1E] hover:bg-[#F8FAFC]'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-inter disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="bg-[#1A146B] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-serif text-2xl font-bold">Chi Tiết Bình Luận</h3>
                <p className="text-sm text-[#C3C0FF] mt-1">ID: {selectedComment.id} | Ngày đăng: {new Date(selectedComment.created_at).toLocaleString('vi-VN')}</p>
              </div>
              <button 
                onClick={() => setSelectedComment(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-8 space-y-6">
              
              {/* Author & Status */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1A146B] to-[#0F172A] text-white flex items-center justify-center font-bold text-lg">
                    {getInitials(selectedComment.author_name)}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-slate-800">{selectedComment.author_name || 'Khách'}</p>
                    <p className="text-sm text-slate-500">Người dùng</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex gap-2 justify-end mb-2">
                    <span className={`inline-block px-3 py-1 rounded-full font-bold text-xs ${(typeColors[selectedComment.mlp_label] || typeColors.Clean).badge} ${(typeColors[selectedComment.mlp_label] || typeColors.Clean).text}`}>
                      MLP: {selectedComment.mlp_label}
                    </span>
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-bold text-xs">
                      Độ tin cậy: {(selectedComment.mlp_confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-md font-bold text-xs ${
                    selectedComment.status === 'blocked' ? 'bg-red-100 text-red-800' :
                    selectedComment.status === 'posted_smart' || selectedComment.status === 'posted_censored' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    TRẠNG THÁI: {statusLabels[selectedComment.status] || selectedComment.status}
                  </span>
                </div>
              </div>

              {/* Related Post */}
              {selectedComment.blog && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">BÀI VIẾT LIÊN QUAN</p>
                  <a href={`/blog/${selectedComment.blog.id}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#1A146B] hover:underline flex items-center gap-2">
                    📄 {selectedComment.blog.title}
                  </a>
                </div>
              )}

              {/* Contents */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                  <p className="text-xs font-bold text-red-600 uppercase mb-2">NỘI DUNG GỐC (VI PHẠM)</p>
                  <p className="text-red-900 italic text-sm">{selectedComment.content}</p>
                  {selectedComment.bad_words && selectedComment.bad_words.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[10px] font-bold text-red-500 uppercase">TỪ TỤC ĐÃ PHÁT HIỆN:</p>
                      <div className="flex gap-1 flex-wrap mt-1">
                        {selectedComment.bad_words.map(w => (
                          <span key={w} className="px-2 py-0.5 bg-red-200 text-red-800 rounded-md text-[10px] font-bold">"{w}"</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-600 uppercase mb-2">NỘI DUNG HIỂN THỊ TRÊN BLOG</p>
                  <p className="text-emerald-900 font-medium text-sm">
                    {selectedComment.status === 'blocked' ? (
                      <span className="text-slate-400 italic">Đã bị chặn hoàn toàn, không hiển thị trên blog.</span>
                    ) : (
                      selectedComment.displayed_text || selectedComment.content
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleDelete(selectedComment.id)}
                className="px-5 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-bold shadow-sm hover:bg-red-50 transition-colors"
              >
                🗑️ Xóa Bình Luận
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedComment(null)}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors"
                >
                  Đóng
                </button>
                <button
                  onClick={() => navigate(`/blog/${selectedComment.blog_id}#comment-${selectedComment.id}`)}
                  disabled={selectedComment.status === 'blocked'}
                  className="px-5 py-2.5 bg-[#1A146B] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#0F0B4B] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  🔗 Đi đến bình luận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
