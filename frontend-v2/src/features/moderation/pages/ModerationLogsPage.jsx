import React, { useState, useEffect } from 'react';
import { getModerationLogs } from '../../../shared/services/moderation.service';

export default function ModerationLogsPage() {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const itemsPerPage = 5;
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
        <div className="max-w-6xl mx-auto bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-4 text-left font-inter font-bold text-xs text-[#474651] uppercase">Người Dùng</th>
                <th className="px-6 py-4 text-left font-inter font-bold text-xs text-[#474651] uppercase">Nội Dung Gốc</th>
                <th className="px-6 py-4 text-left font-inter font-bold text-xs text-[#474651] uppercase">Nội Dung Hiển Thị</th>
                <th className="px-6 py-4 text-left font-inter font-bold text-xs text-[#474651] uppercase">Nhãn AI</th>
                <th className="px-6 py-4 text-left font-inter font-bold text-xs text-[#474651] uppercase">Hành Động</th>
                <th className="px-6 py-4 text-left font-inter font-bold text-xs text-[#474651] uppercase">Thời Gian</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : paginatedLogs.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">Không có dữ liệu</td></tr>
              ) : (
                paginatedLogs.map((log) => {
                  const comment = log;
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
                            <p className="font-inter text-xs text-[#474651]">ID: {comment.id}</p>
                          </div>
                        </div>
                      </td>
                      {/* Original Content */}
                      <td className="px-6 py-4">
                        <p className="font-inter text-sm text-red-600 line-through opacity-70 italic max-w-[200px] truncate">{comment.content}</p>
                      </td>
                      {/* Displayed Content */}
                      <td className="px-6 py-4">
                        <p className="font-inter text-sm text-[#191C1E] font-medium max-w-[200px] truncate">
                          {comment.displayed_text || <span className="text-gray-400 italic">Không hiển thị</span>}
                        </p>
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
                      {/* Time */}
                      <td className="px-6 py-4">
                        <p className="font-inter text-sm text-[#191C1E]">
                          {new Date(comment.created_at).toLocaleString('vi-VN')}
                        </p>
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
    </div>
  );
}
