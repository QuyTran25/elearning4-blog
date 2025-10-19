// Create Blog Page - Full Functionality
let editMode = false
let editBlogId = null
let selectedImage = null
let autoSaveInterval = null

document.addEventListener("DOMContentLoaded", () => {
  console.log('🚀 Initializing create-blog page...')
  
  // Require authentication
  const user = getCurrentUser()
  if (!user) {
    alert('Vui lòng đăng nhập để viết bài')
    window.location.href = 'login.html'
    return
  }

  // Check if editing
  const urlParams = new URLSearchParams(window.location.search)
  editBlogId = urlParams.get("id")

  if (editBlogId) {
    editMode = true
    loadBlogForEdit()
  }

  setupForm()
  setupCounters()
  setupImageUpload()
  setupTags()
  setupToolbar()
  setupPreview()
  setupDraftButtons()
  setupAutoSave()
  loadDraft()
  
  console.log('✅ Create-blog page ready!')
})

// ========== LOAD BLOG FOR EDIT ==========
function loadBlogForEdit() {
  console.log('📝 Loading blog for edit:', editBlogId)
  const blog = getBlogById(editBlogId)

  if (!blog) {
    alert('Không tìm thấy bài viết')
    window.location.href = "blogs.html"
    return
  }

  // Check if user owns this blog
  const currentUser = getCurrentUser()
  if (blog.author.id !== currentUser.id) {
    alert('Bạn không có quyền chỉnh sửa bài viết này')
    window.location.href = "blogs.html"
    return
  }

  // Update form title
  document.getElementById('formTitle').textContent = '✏️ Chỉnh sửa bài viết'
  document.getElementById('publishBtnText').textContent = '💾 Cập nhật bài viết'
  
  // Populate form fields
  document.getElementById('title').value = blog.title || ''
  document.getElementById('category').value = blog.category || ''
  document.getElementById('summary').value = blog.summary || ''
  document.getElementById('tags').value = blog.tags ? blog.tags.join(', ') : ''
  document.getElementById('content').value = blog.content || ''

  // Load image if exists
  if (blog.image) {
    selectedImage = blog.image
    displayImagePreview(blog.image)
  }

  // Update counters
  updateAllCounters()
  updateTagsPreview()
}

// ========== COUNTERS ==========
function setupCounters() {
  const titleInput = document.getElementById('title')
  const summaryInput = document.getElementById('summary')
  const contentInput = document.getElementById('content')
  
  titleInput?.addEventListener('input', updateTitleCounter)
  summaryInput?.addEventListener('input', updateSummaryCounter)
  contentInput?.addEventListener('input', updateContentCounter)
}

function updateTitleCounter() {
  const title = document.getElementById('title').value
  const counter = document.getElementById('titleCount')
  if (counter) {
    counter.textContent = title.length
    counter.style.color = title.length > 100 ? '#e74c3c' : ''
  }
}

function updateSummaryCounter() {
  const summary = document.getElementById('summary').value
  const counter = document.getElementById('summaryCount')
  if (counter) {
    counter.textContent = summary.length
    counter.style.color = summary.length > 200 ? '#e74c3c' : ''
  }
}

function updateContentCounter() {
  const content = document.getElementById('content').value
  const counter = document.getElementById('contentCount')
  const readingTime = document.getElementById('readingTime')
  
  if (counter) counter.textContent = content.length
  if (readingTime) {
    const words = content.trim().split(/\s+/).length
    readingTime.textContent = Math.ceil(words / 200) || 0
  }
}

function updateAllCounters() {
  updateTitleCounter()
  updateSummaryCounter()
  updateContentCounter()
}

// ========== IMAGE UPLOAD ==========
function setupImageUpload() {
  const uploadArea = document.getElementById('imageUploadArea')
  const fileInput = document.getElementById('image')
  const uploadLink = uploadArea?.querySelector('.upload-link')
  
  if (!uploadArea || !fileInput) return
  
  uploadLink?.addEventListener('click', (e) => {
    e.stopPropagation()
    fileInput.click()
  })
  
  uploadArea.addEventListener('click', (e) => {
    if (!e.target.closest('.remove-image')) fileInput.click()
  })
  
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault()
    uploadArea.style.borderColor = '#667eea'
  })
  
  uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault()
    uploadArea.style.borderColor = ''
  })
  
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault()
    uploadArea.style.borderColor = ''
    if (e.dataTransfer.files.length > 0) handleImageFile(e.dataTransfer.files[0])
  })
  
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleImageFile(e.target.files[0])
  })
}

function handleImageFile(file) {
  if (!file.type.startsWith('image/')) {
    alert('Vui lòng chọn file hình ảnh')
    return
  }
  
  if (file.size > 5 * 1024 * 1024) {
    alert('File ảnh không được vượt quá 5MB')
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    selectedImage = e.target.result
    displayImagePreview(selectedImage)
  }
  reader.readAsDataURL(file)
}

function displayImagePreview(imageSrc) {
  const preview = document.getElementById('imagePreview')
  const uploadPlaceholder = document.querySelector('.upload-placeholder')
  
  if (preview) {
    preview.innerHTML = `
      <div style="position: relative;">
        <img src="${imageSrc}" alt="Preview" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
        <button type="button" onclick="removeImage()" style="position: absolute; top: 10px; right: 10px; background: #e74c3c; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; font-size: 18px; line-height: 1;">×</button>
      </div>
    `
    preview.style.display = 'block'
    if (uploadPlaceholder) uploadPlaceholder.style.display = 'none'
  }
}

function removeImage() {
  selectedImage = null
  const preview = document.getElementById('imagePreview')
  const fileInput = document.getElementById('image')
  const uploadPlaceholder = document.querySelector('.upload-placeholder')
  
  if (preview) {
    preview.innerHTML = ''
    preview.style.display = 'none'
  }
  if (uploadPlaceholder) uploadPlaceholder.style.display = 'block'
  if (fileInput) fileInput.value = ''
}

// ========== TAGS ==========
function setupTags() {
  const tagsInput = document.getElementById('tags')
  if (tagsInput) {
    tagsInput.addEventListener('input', updateTagsPreview)
    tagsInput.addEventListener('blur', updateTagsPreview)
  }
}

function updateTagsPreview() {
  const tagsInput = document.getElementById('tags')
  const tagsPreview = document.getElementById('tagsPreview')
  
  if (!tagsInput || !tagsPreview) return
  
  const tagsText = tagsInput.value.trim()
  if (!tagsText) {
    tagsPreview.innerHTML = ''
    return
  }
  
  const tags = tagsText.split(',').map(tag => tag.trim()).filter(tag => tag)
  tagsPreview.innerHTML = tags.map((tag, index) => `
    <span style="display: inline-block; background: #667eea; color: white; padding: 4px 10px; border-radius: 12px; margin: 4px; font-size: 12px;">
      #${tag}
      <span onclick="removeTag(${index})" style="cursor: pointer; margin-left: 5px; font-weight: bold;">×</span>
    </span>
  `).join('')
}

function removeTag(index) {
  const tagsInput = document.getElementById('tags')
  if (!tagsInput) return
  
  const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag)
  tags.splice(index, 1)
  tagsInput.value = tags.join(', ')
  updateTagsPreview()
}

// ========== TOOLBAR ==========
function setupToolbar() {
  const toolbarBtns = document.querySelectorAll('.toolbar-btn')
  const contentTextarea = document.getElementById('content')
  
  toolbarBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      const action = btn.dataset.action
      applyFormat(action, contentTextarea)
    })
  })
}

function applyFormat(action, textarea) {
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)
  let replacement = ''
  
  switch (action) {
    case 'bold':
      replacement = `**${selectedText || 'text đậm'}**`
      break
    case 'italic':
      replacement = `*${selectedText || 'text nghiêng'}*`
      break
    case 'code':
      replacement = `\`${selectedText || 'code'}\``
      break
    case 'link':
      replacement = `[${selectedText || 'link text'}](url)`
      break
    case 'list':
      replacement = `\n- ${selectedText || 'item 1'}\n- item 2\n- item 3`
      break
  }
  
  textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end)
  textarea.focus()
  updateContentCounter()
}

// ========== PREVIEW ==========
function setupPreview() {
  const previewBtn = document.getElementById('previewBtn')
  const modal = document.getElementById('previewModal')
  const closeBtn = document.getElementById('closePreview')
  
  previewBtn?.addEventListener('click', showPreview)
  closeBtn?.addEventListener('click', hidePreview)
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) hidePreview()
  })
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.style.display === 'flex') hidePreview()
  })
}

function showPreview() {
  const title = document.getElementById('title').value || 'Tiêu đề bài viết'
  const category = document.getElementById('category').value || 'other'
  const summary = document.getElementById('summary').value
  const tags = document.getElementById('tags').value
  const content = document.getElementById('content').value || 'Nội dung bài viết...'
  
  document.getElementById('previewTitle').textContent = title
  document.getElementById('previewCategory').textContent = getCategoryName(category)
  document.getElementById('previewSummary').textContent = summary || 'Không có tóm tắt'
  document.getElementById('previewContent').innerHTML = formatContent(content)
  
  const tagsPreview = document.getElementById('previewTags')
  if (tags.trim()) {
    const tagsList = tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    tagsPreview.innerHTML = tagsList.map(tag => 
      `<span style="display: inline-block; background: #667eea; color: white; padding: 4px 10px; border-radius: 12px; margin: 4px; font-size: 12px;">#${tag}</span>`
    ).join('')
  } else {
    tagsPreview.innerHTML = '<span style="color: #999;">Không có tags</span>'
  }
  
  document.getElementById('previewModal').style.display = 'flex'
  document.body.style.overflow = 'hidden'
}

function hidePreview() {
  document.getElementById('previewModal').style.display = 'none'
  document.body.style.overflow = ''
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

function formatContent(content) {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background: #f4f4f4; padding: 2px 6px; border-radius: 3px;">$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: #667eea;">$1</a>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul style="margin: 15px 0; padding-left: 30px;">$&</ul>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
}

// ========== DRAFT FUNCTIONALITY ==========
const DRAFTS_KEY = 'tech_blog_drafts'

function setupDraftButtons() {
  const saveDraftBtn = document.getElementById('saveDraftBtn')
  saveDraftBtn?.addEventListener('click', () => saveDraft(true))
}

function setupAutoSave() {
  autoSaveInterval = setInterval(() => {
    const formData = getFormData()
    if (formData.title.trim() || formData.content.trim()) {
      saveDraft(false)
    }
  }, 60000)
}

function saveDraft(showNotification = true) {
  const formData = getFormData()
  
  if (!formData.title.trim() && !formData.content.trim()) {
    if (showNotification) alert('Vui lòng nhập tiêu đề hoặc nội dung để lưu nháp')
    return
  }
  
  const drafts = getAllDrafts()
  const draftId = editMode ? `edit_${editBlogId}` : `new_${Date.now()}`
  
  const draft = {
    id: draftId,
    ...formData,
    savedAt: new Date().toISOString(),
    isEdit: editMode,
    editBlogId: editMode ? editBlogId : null
  }
  
  const existingIndex = drafts.findIndex(d => d.id === draftId || (d.isEdit && d.editBlogId === editBlogId))
  if (existingIndex >= 0) {
    drafts[existingIndex] = draft
  } else {
    drafts.unshift(draft)
  }
  
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts.slice(0, 10)))
  
  if (showNotification) alert('✅ Đã lưu bản nháp!')
}

function getAllDrafts() {
  const drafts = localStorage.getItem(DRAFTS_KEY)
  return drafts ? JSON.parse(drafts) : []
}

function loadDraft() {
  if (editMode) return
  
  const drafts = getAllDrafts()
  const newDrafts = drafts.filter(d => !d.isEdit)
  
  if (newDrafts.length > 0) {
    const latestDraft = newDrafts[0]
    const savedDate = new Date(latestDraft.savedAt).toLocaleString('vi-VN')
    
    if (confirm(`Có bản nháp chưa hoàn thành (lưu lúc ${savedDate}).\n\nTiêu đề: "${latestDraft.title}"\n\nBạn có muốn khôi phục không?`)) {
      document.getElementById('title').value = latestDraft.title || ''
      document.getElementById('category').value = latestDraft.category || ''
      document.getElementById('summary').value = latestDraft.summary || ''
      document.getElementById('tags').value = latestDraft.tags ? latestDraft.tags.join(', ') : ''
      document.getElementById('content').value = latestDraft.content || ''
      
      if (latestDraft.image) {
        selectedImage = latestDraft.image
        displayImagePreview(latestDraft.image)
      }
      
      updateAllCounters()
      updateTagsPreview()
      alert('✅ Đã khôi phục bản nháp!')
    }
  }
}

function clearDraft() {
  const drafts = getAllDrafts()
  const filtered = editMode 
    ? drafts.filter(d => d.id !== `edit_${editBlogId}` && !(d.isEdit && d.editBlogId === editBlogId))
    : drafts.filter(d => d.isEdit)
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(filtered))
}

// ========== FORM SUBMISSION ==========
function setupForm() {
  const form = document.getElementById('blogForm')
  form?.addEventListener('submit', handleSubmit)
}

function getFormData() {
  const tags = document.getElementById('tags').value.trim()
  
  return {
    title: document.getElementById('title').value.trim(),
    category: document.getElementById('category').value,
    summary: document.getElementById('summary').value.trim(),
    tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
    content: document.getElementById('content').value.trim(),
    image: selectedImage
  }
}

function handleSubmit(e) {
  e.preventDefault()
  
  const formData = getFormData()
  
  // Validation
  if (!formData.title.trim()) {
    alert('❌ Vui lòng nhập tiêu đề bài viết')
    document.getElementById('title').focus()
    return
  }
  
  if (formData.title.length > 100) {
    alert('❌ Tiêu đề không được vượt quá 100 ký tự')
    return
  }
  
  if (!formData.category) {
    alert('❌ Vui lòng chọn danh mục')
    return
  }
  
  if (!formData.content.trim()) {
    alert('❌ Vui lòng nhập nội dung bài viết')
    return
  }
  
  // Show loading
  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  submitBtn.disabled = true
  submitBtn.innerHTML = editMode ? '⏳ Đang cập nhật...' : '⏳ Đang xuất bản...'
  
  setTimeout(() => {
    try {
      const blogData = {
        title: formData.title,
        category: formData.category,
        content: formData.content,
        image: formData.image,
        summary: formData.summary,
        tags: formData.tags
      }
      
      let result
      if (editMode) {
        result = updateBlog(editBlogId, blogData)
      } else {
        result = createBlog(blogData)
      }
      
      if (result) {
        if (autoSaveInterval) clearInterval(autoSaveInterval)
        clearDraft()
        alert(editMode ? '✅ Cập nhật bài viết thành công!' : '✅ Xuất bản bài viết thành công!')
        const blogId = editMode ? editBlogId : result.id
        window.location.href = `blog-detail.html?id=${blogId}`
      } else {
        throw new Error('Failed to save blog')
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('❌ Có lỗi xảy ra. Vui lòng thử lại.')
      submitBtn.disabled = false
      submitBtn.innerHTML = originalText
    }
  }, 1000)
}

// ========== CLEANUP ==========
window.addEventListener('beforeunload', () => {
  const formData = getFormData()
  if ((formData.title.trim() || formData.content.trim()) && !document.querySelector('button[type="submit"]').disabled) {
    saveDraft(false)
  }
  if (autoSaveInterval) clearInterval(autoSaveInterval)
})
