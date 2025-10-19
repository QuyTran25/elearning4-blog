// Drafts Page
const DRAFTS_KEY = 'tech_blog_drafts'

document.addEventListener("DOMContentLoaded", () => {
  console.log('🚀 Initializing drafts page...')
  
  // Require authentication
  const user = getCurrentUser()
  if (!user) {
    alert('Vui lòng đăng nhập để xem bản nháp')
    window.location.href = 'login.html'
    return
  }

  loadDrafts()
  console.log('✅ Drafts page ready!')
})

function loadDrafts() {
  const drafts = getAllDrafts()
  const container = document.getElementById('draftsContainer')
  const noDrafts = document.getElementById('noDrafts')
  
  if (drafts.length === 0) {
    container.innerHTML = ''
    noDrafts.style.display = 'block'
    return
  }
  
  noDrafts.style.display = 'none'
  container.innerHTML = drafts.map((draft, index) => {
    const savedDate = new Date(draft.savedAt).toLocaleString('vi-VN')
    const wordCount = draft.content ? draft.content.trim().split(/\s+/).length : 0
    
    return `
      <div class="draft-card" style="background: white; border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; margin-bottom: 20px; transition: all 0.3s;">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div style="flex: 1;">
            <h3 style="margin: 0 0 10px 0; font-size: 20px; color: #2d3748;">
              ${draft.title || '<em style="color: #999;">Chưa có tiêu đề</em>'}
            </h3>
            <div style="display: flex; gap: 15px; margin-bottom: 10px; flex-wrap: wrap;">
              <span style="color: #666; font-size: 14px;">📂 ${getCategoryName(draft.category) || 'Chưa chọn'}</span>
              <span style="color: #666; font-size: 14px;">📝 ${wordCount} từ</span>
              <span style="color: #666; font-size: 14px;">🕒 ${savedDate}</span>
              ${draft.isEdit ? '<span style="background: #fff3cd; color: #856404; padding: 2px 8px; border-radius: 4px; font-size: 12px;">✏️ Chỉnh sửa</span>' : '<span style="background: #d1ecf1; color: #0c5460; padding: 2px 8px; border-radius: 4px; font-size: 12px;">✨ Bài mới</span>'}
            </div>
            ${draft.summary ? `<p style="color: #666; margin: 10px 0; line-height: 1.6;">${draft.summary}</p>` : ''}
            ${draft.tags && draft.tags.length > 0 ? `
              <div style="margin-top: 10px;">
                ${draft.tags.map(tag => `<span style="background: #667eea; color: white; padding: 3px 8px; border-radius: 10px; font-size: 11px; margin-right: 5px; display: inline-block;">#${tag}</span>`).join('')}
              </div>
            ` : ''}
          </div>
          ${draft.image ? `<img src="${draft.image}" alt="Draft image" style="width: 120px; height: 80px; object-fit: cover; border-radius: 8px; margin-left: 20px;">` : ''}
        </div>
        <div style="display: flex; gap: 10px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <button onclick="continueDraft(${index})" class="btn btn-primary" style="flex: 1;">✏️ Tiếp tục viết</button>
          <button onclick="previewDraft(${index})" class="btn btn-outline" style="flex: 1;">👀 Xem trước</button>
          <button onclick="deleteDraft(${index})" class="btn btn-danger" style="background: #e74c3c;">🗑️ Xóa</button>
        </div>
      </div>
    `
  }).join('')
}

function getAllDrafts() {
  const drafts = localStorage.getItem(DRAFTS_KEY)
  return drafts ? JSON.parse(drafts) : []
}

function getCategoryName(value) {
  const categories = {
    'javascript': '🟡 JavaScript', 'python': '🐍 Python', 'react': '⚛️ React',
    'nodejs': '🟢 Node.js', 'css': '🎨 CSS', 'web-development': '🌐 Web Development',
    'mobile-development': '📱 Mobile Development', 'devops': '🔧 DevOps',
    'ai-ml': '🤖 AI/ML', 'database': '💾 Database', 'tutorial': '📚 Tutorial',
    'tips-tricks': '💡 Tips & Tricks', 'other': '❓ Khác'
  }
  return categories[value] || value
}

function continueDraft(index) {
  const drafts = getAllDrafts()
  const draft = drafts[index]
  
  if (!draft) {
    alert('Không tìm thấy bản nháp')
    return
  }
  
  // Store draft in a temporary key for create-blog to load
  localStorage.setItem('temp_draft_to_load', JSON.stringify(draft))
  
  // Navigate to create-blog
  if (draft.isEdit && draft.editBlogId) {
    window.location.href = `create-blog.html?id=${draft.editBlogId}`
  } else {
    window.location.href = 'create-blog.html'
  }
}

function previewDraft(index) {
  const drafts = getAllDrafts()
  const draft = drafts[index]
  
  if (!draft) {
    alert('Không tìm thấy bản nháp')
    return
  }
  
  // Create preview modal
  const modal = document.createElement('div')
  modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 20px;'
  
  modal.innerHTML = `
    <div style="background: white; border-radius: 12px; max-width: 900px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 40px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
        <h2 style="margin: 0;">👀 Xem trước bản nháp</h2>
        <button onclick="this.closest('div[style*=fixed]').remove()" style="background: #e74c3c; color: white; border: none; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; font-size: 20px;">×</button>
      </div>
      <article>
        <div style="margin-bottom: 20px;">
          <span style="background: #667eea; color: white; padding: 5px 12px; border-radius: 15px; font-size: 13px;">${getCategoryName(draft.category) || 'Khác'}</span>
        </div>
        <h1 style="font-size: 32px; margin: 20px 0;">${draft.title || 'Chưa có tiêu đề'}</h1>
        ${draft.summary ? `<p style="color: #666; font-size: 16px; line-height: 1.8; margin: 20px 0;">${draft.summary}</p>` : ''}
        ${draft.tags && draft.tags.length > 0 ? `
          <div style="margin: 20px 0;">
            ${draft.tags.map(tag => `<span style="background: #667eea; color: white; padding: 4px 10px; border-radius: 12px; margin-right: 8px; font-size: 12px;">#${tag}</span>`).join('')}
          </div>
        ` : ''}
        ${draft.image ? `<img src="${draft.image}" alt="Draft image" style="width: 100%; border-radius: 12px; margin: 20px 0;">` : ''}
        <div style="line-height: 1.8; color: #333; margin-top: 30px;">
          ${formatContent(draft.content || 'Chưa có nội dung')}
        </div>
      </article>
    </div>
  `
  
  document.body.appendChild(modal)
  document.body.style.overflow = 'hidden'
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove()
      document.body.style.overflow = ''
    }
  })
}

function formatContent(content) {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: monospace; color: #e83e8c;">$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: #667eea;">$1</a>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul style="margin: 15px 0; padding-left: 30px;">$&</ul>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
}

function deleteDraft(index) {
  if (!confirm('Bạn có chắc chắn muốn xóa bản nháp này?')) {
    return
  }
  
  const drafts = getAllDrafts()
  drafts.splice(index, 1)
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts))
  
  alert('✅ Đã xóa bản nháp!')
  loadDrafts()
}
