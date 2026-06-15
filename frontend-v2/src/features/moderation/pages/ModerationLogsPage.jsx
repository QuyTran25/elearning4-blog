import React, { useState } from 'react';

export default function ModerationLogsPage() {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data for demonstration
  const mockLogs = [
    {
      id: 1,
      user: { name: 'Tuấn Nguyễn', id: 'ID: 89321' },
      comment: '"Ban chặng bẩn gì về công nghệ cả, dùng việt tào ứng cụng..."',
      post: 'TWho Là Của AI...',
      type: 'TOXIC',
      time: '14:20 Hôm nay',
      status: 'handled'
    },
    {
      id: 2,
      user: { name: 'Linh Hoàng', id: 'ID: 77453' },
      comment: '"Đó ngộc, cách hiểp cần này lỗi thời rồi"',
      post: 'React Server Components',
      type: 'INSULT',
      time: '11:05 Hôm nay',
      status: 'pending'
    },
    {
      id: 3,
      user: { name: 'Duy Khánh', id: 'ID: 16283' },
      comment: '"TRUY CBP NGAY bit.ly/spam-link ĐỂ NHẬN QUÀ..."',
      post: 'Bản tin công nghệ',
      type: 'SPAM',
      time: '09:45 Hôm nay',
      status: 'handled'
    },
    {
      id: 4,
      user: { name: 'Minh Anh', id: 'ID: 55621' },
      comment: '"Cần thắn cái mồm, bọi biết gì..."',
      post: 'Privacy Policy...',
      type: 'THREAT',
      time: '22:15 Ngày mai',
      status: 'pending'
    }
  ];

  const typeColors = {
    TOXIC: { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100' },
    INSULT: { bg: 'bg-orange-50', text: 'text-orange-700', badge: 'bg-orange-100' },
    SPAM: { bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-100' },
    THREAT: { bg: 'bg-red-900', text: 'text-red-700', badge: 'bg-red-900' }
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const filteredLogs = mockLogs.filter(log => {
    const matchType = filterType === 'all' || log.type === filterType;
    const matchStatus = status === 'all' || (status === 'handled' && log.status === 'handled') || (status === 'pending' && log.status === 'pending');
    const matchSearch = searchQuery === '' || 
      log.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  const itemsPerPage = 4;
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
                Logs Bình Luận Vi Phạm
              </h1>
              <p className="font-inter font-normal text-base text-[#474651]">
                Kiểm duyệt và duy trì tiêu chuẩn cộng đồng bằng cách xử lý các báo cáo vi phạm.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button className="flex items-center gap-2 bg-white border border-[#C8C5D3] rounded-2xl px-6 py-3.5 font-inter font-normal text-base text-[#191C1E] hover:bg-[#F8FAFC] transition-colors">
                <span>📥</span> Xuất Báo Cáo
              </button>
              <button className="flex items-center gap-2 bg-[#1A146B] text-white rounded-2xl px-6 py-3.5 font-inter font-normal text-base hover:bg-[#0F0B4B] transition-colors shadow-sm">
                <span>🔄</span> Làm Mới
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-3 gap-8">
            {/* Type Filter */}
            <div>
              <label className="block font-inter font-normal text-base text-[#474651] mb-2">Loại vi phạm</label>
              <select
                value={filterType}
                onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
                className="w-full bg-white border border-[#C8C5D3] rounded-2xl px-4 py-3 font-inter text-base text-[#191C1E] focus:outline-none"
              >
                <option value="all">Tất cả vi phạm</option>
                <option value="TOXIC">Toxic</option>
                <option value="INSULT">Insult</option>
                <option value="SPAM">Spam</option>
                <option value="THREAT">Threat</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block font-inter font-normal text-base text-[#474651] mb-2">Tìm kiếm nhanh</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Nhập từ khóa, ID người dùng hoặc nội dung bài viết..."
                className="w-full bg-white border border-[#C8C5D3] rounded-2xl px-4 py-3 font-inter text-base text-[#191C1E] placeholder-[#6B7280] focus:outline-none"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block font-inter font-normal text-base text-[#474651] mb-2">Trạng thái xử lý</label>
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
                  onClick={() => { setStatus('pending'); setCurrentPage(1); }}
                  className={`flex-1 px-4 py-2 rounded-lg font-inter text-sm font-medium transition-colors ${
                    status === 'pending' ? 'bg-[#1A146B] text-white' : 'bg-white border border-[#C8C5D3] text-[#191C1E]'
                  }`}
                >
                  Đang xét
                </button>
                <button
                  onClick={() => { setStatus('handled'); setCurrentPage(1); }}
                  className={`flex-1 px-4 py-2 rounded-lg font-inter text-sm font-medium transition-colors ${
                    status === 'handled' ? 'bg-[#1A146B] text-white' : 'bg-white border border-[#C8C5D3] text-[#191C1E]'
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
                <th className="px-6 py-4 text-left font-inter font-bold text-xs text-[#474651] uppercase">Nội Dung Vi Phạm</th>
                <th className="px-6 py-4 text-left font-inter font-bold text-xs text-[#474651] uppercase">Bài Viết Liên Quan</th>
                <th className="px-6 py-4 text-left font-inter font-bold text-xs text-[#474651] uppercase">Loại</th>
                <th className="px-6 py-4 text-left font-inter font-bold text-xs text-[#474651] uppercase">Thời Gian</th>
                <th className="px-6 py-4 text-left font-inter font-bold text-xs text-[#474651] uppercase">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.map((log) => {
                const colors = typeColors[log.type] || typeColors.TOXIC;
                return (
                  <tr key={log.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A146B] to-[#0F172A] text-white flex items-center justify-center font-inter font-bold text-sm">
                          {getInitials(log.user.name)}
                        </div>
                        <div>
                          <p className="font-inter font-semibold text-sm text-[#191C1E]">{log.user.name}</p>
                          <p className="font-inter text-xs text-[#474651]">{log.user.id}</p>
                        </div>
                      </div>
                    </td>
                    {/* Comment */}
                    <td className="px-6 py-4">
                      <p className="font-inter text-sm text-[#191C1E] italic max-w-xs truncate">{log.comment}</p>
                    </td>
                    {/* Post */}
                    <td className="px-6 py-4">
                      <a href="#" className="font-inter text-sm text-[#1A146B] underline hover:text-[#0F0B4B]">
                        {log.post}
                      </a>
                    </td>
                    {/* Type */}
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full font-inter font-bold text-xs ${colors.badge}`}>
                        <span className={colors.text}>{log.type}</span>
                      </span>
                    </td>
                    {/* Time */}
                    <td className="px-6 py-4">
                      <p className="font-inter text-sm text-[#191C1E]">{log.time}</p>
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4">
                      <button className="font-inter text-sm text-[#1A146B] font-semibold hover:underline">
                        Xem Chi Tiết
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="max-w-6xl mx-auto mt-6 flex items-center justify-between">
          <p className="font-inter text-sm text-[#474651]">
            Hiển thị {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredLogs.length)} của {filteredLogs.length} kết quả
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

        {/* Stats */}
        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-3 gap-6">
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-6">
            <p className="font-inter text-xs text-[#474651] uppercase font-bold mb-2">Tỉ lệ vi phạm tháng này</p>
            <p className="font-inter font-bold text-2xl text-[#191C1E]">+12.5% <span className="text-red-600 text-sm">↑ Tăng</span></p>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-6">
            <p className="font-inter text-xs text-[#474651] uppercase font-bold mb-2">Trung bình phản hồi</p>
            <p className="font-inter font-bold text-2xl text-[#191C1E]">1.2 giờ <span className="text-blue-600 text-sm">🔵 Nhanh</span></p>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-6">
            <p className="font-inter text-xs text-[#474651] uppercase font-bold mb-2">Hành động tự động</p>
            <p className="font-inter font-bold text-2xl text-[#191C1E]">82% <span className="text-purple-600 text-sm">👍 Hiệu quả</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
