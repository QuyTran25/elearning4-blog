let editMode = false;
let editBlogId = null;
let selectedImage = null;
let autoSaveInterval = null;

// Helper function to require authentication
function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    toast.error('Vui lòng đăng nhập để viết bài');
    window.location.href = 'login.html';
    return null;
  }
  return user;
}

document.addEventListener("DOMContentLoaded", () => {
  // Require authentication
  const user = requireAuth();
  if (!user) return;

  // Check if editing
  const urlParams = new URLSearchParams(window.location.search);
  editBlogId = urlParams.get("id");

  if (editBlogId) {
    editMode = true;
    loadBlogForEdit();
  }

  setupForm();
  setupCounters();
  setupImageUpload();
  setupTags();
  setupToolbar();
  setupPreview();
  setupAutoSave();
});

function loadBlogForEdit() {
  const blogs = getBlogs();
  const blog = blogs.find(b => b.id === editBlogId);

  if (!blog) {
    toast.error('Không tìm thấy bài viết');
    window.location.href = "blogs.html";
    return;
  }

  // Check if user owns this blog
  const currentUser = getCurrentUser();
  if (blog.authorId !== currentUser.id) {
    toast.error('Bạn không có quyền chỉnh sửa bài viết này');
    window.location.href = "blogs.html";
    return;
  }

  // Update form title
  document.getElementById('formTitle').textContent = '✏️ Chỉnh sửa bài viết';
  
  // Populate form fields
  document.getElementById('title').value = blog.title || '';
  document.getElementById('category').value = blog.category || '';
  document.getElementById('summary').value = blog.summary || '';
  document.getElementById('tags').value = blog.tags ? blog.tags.join(', ') : '';
  document.getElementById('content').value = blog.content || '';

  // Update counters
  updateAllCounters();
  updateTagsPreview();
}

function setupCounters() {
  const titleInput = document.getElementById('title');
  const summaryInput = document.getElementById('summary');
  const contentInput = document.getElementById('content');
  
  titleInput?.addEventListener('input', updateTitleCounter);
  summaryInput?.addEventListener('input', updateSummaryCounter);
  contentInput?.addEventListener('input', updateContentCounter);
}

function updateTitleCounter() {
  const title = document.getElementById('title').value;
  const counter = document.getElementById('titleCount');
  if (counter) {
    counter.textContent = title.length;
    counter.style.color = title.length > 100 ? 'var(--danger-color)' : 'var(--text-muted)';
  }
}

function updateSummaryCounter() {
  const summary = document.getElementById('summary').value;
  const counter = document.getElementById('summaryCount');
  if (counter) {
    counter.textContent = summary.length;
    counter.style.color = summary.length > 200 ? 'var(--danger-color)' : 'var(--text-muted)';
  }
}

function updateContentCounter() {
  const content = document.getElementById('content').value;
  const counter = document.getElementById('contentCount');
  const readingTime = document.getElementById('readingTime');
  
  if (counter) {
    counter.textContent = content.length;
  }
  
  if (readingTime) {
    // Estimate reading time (200 words per minute)
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / 200);
    readingTime.textContent = time;
  }
}

function updateAllCounters() {
  updateTitleCounter();
  updateSummaryCounter();
  updateContentCounter();
}

function setupImageUpload() {
  const uploadArea = document.getElementById('imageUploadArea');
  const fileInput = document.getElementById('image');
  
  if (!uploadArea || !fileInput) return;
  
  uploadArea.addEventListener('click', () => fileInput.click());
  
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--primary-color)';
    uploadArea.style.background = 'var(--surface-dark)';
  });
  
  uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '';
    uploadArea.style.background = '';
  });
  
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '';
    uploadArea.style.background = '';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageFile(files[0]);
    }
  });
  
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleImageFile(e.target.files[0]);
    }
  });
}

function handleImageFile(file) {
  if (!file.type.startsWith('image/')) {
    toast.error('Vui lòng chọn file hình ảnh');
    return;
  }
  
  if (file.size > 5 * 1024 * 1024) {
    toast.error('File ảnh không được vượt quá 5MB');
    return;
  }
  
  selectedImage = file;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const preview = document.getElementById('imagePreview');
    if (preview) {
      preview.innerHTML = `
        <div class="uploaded-image">
          <img src="${e.target.result}" alt="Preview" style="max-width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
          <button type="button" class="remove-image" onclick="removeImage()">❌</button>
        </div>
      `;
    }
  };
  reader.readAsDataURL(file);
  
  toast.success('Đã tải ảnh thành công');
}

function removeImage() {
  selectedImage = null;
  const preview = document.getElementById('imagePreview');
  const fileInput = document.getElementById('image');
  
  if (preview) {
    preview.innerHTML = '';
  }
  
  if (fileInput) {
    fileInput.value = '';
  }
}

function setupTags() {
  const tagsInput = document.getElementById('tags');
  
  if (tagsInput) {
    tagsInput.addEventListener('input', updateTagsPreview);
    tagsInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        updateTagsPreview();
      }
    });
  }
}

function updateTagsPreview() {
  const tagsInput = document.getElementById('tags');
  const tagsPreview = document.getElementById('tagsPreview');
  
  if (!tagsInput || !tagsPreview) return;
  
  const tagsText = tagsInput.value.trim();
  if (!tagsText) {
    tagsPreview.innerHTML = '';
    return;
  }
  
  const tags = tagsText.split(',').map(tag => tag.trim()).filter(tag => tag);
  
  tagsPreview.innerHTML = tags.map((tag, index) => `
    <span class="tag-item">
      #${tag}
      <span class="remove-tag" onclick="removeTag(${index})">×</span>
    </span>
  `).join('');
}

function removeTag(index) {
  const tagsInput = document.getElementById('tags');
  if (!tagsInput) return;
  
  const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
  tags.splice(index, 1);
  tagsInput.value = tags.join(', ');
  updateTagsPreview();
}

function setupToolbar() {
  const toolbarBtns = document.querySelectorAll('.toolbar-btn');
  const contentTextarea = document.getElementById('content');
  
  toolbarBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const action = btn.dataset.action;
      applyFormat(action, contentTextarea);
    });
  });
}

function applyFormat(action, textarea) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);
  let replacement = '';
  
  switch (action) {
    case 'bold':
      replacement = `**${selectedText || 'text đậm'}**`;
      break;
    case 'italic':
      replacement = `*${selectedText || 'text nghiêng'}*`;
      break;
    case 'code':
      replacement = `\`${selectedText || 'code'}\``;
      break;
    case 'link':
      replacement = `[${selectedText || 'link text'}](url)`;
      break;
    case 'list':
      replacement = `\n- ${selectedText || 'item 1'}\n- item 2\n- item 3`;
      break;
  }
  
  textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
  textarea.focus();
}

function setupPreview() {
  const previewBtn = document.getElementById('previewBtn');
  const modal = document.getElementById('previewModal');
  const closeBtn = document.getElementById('closePreview');
  
  if (previewBtn) {
    previewBtn.addEventListener('click', showPreview);
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', hidePreview);
  }
  
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        hidePreview();
      }
    });
  }
}

function showPreview() {
  const title = document.getElementById('title').value || 'Tiêu đề bài viết';
  const category = document.getElementById('category').value || 'Khác';
  const summary = document.getElementById('summary').value;
  const tags = document.getElementById('tags').value;
  const content = document.getElementById('content').value || 'Nội dung bài viết...';
  
  // Update preview content
  document.getElementById('previewTitle').textContent = title;
  document.getElementById('previewCategory').textContent = category;
  document.getElementById('previewSummary').textContent = summary;
  document.getElementById('previewContent').innerHTML = formatContent(content);
  
  // Update tags
  const tagsPreview = document.getElementById('previewTags');
  if (tags.trim()) {
    const tagsList = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    tagsPreview.innerHTML = tagsList.map(tag => `<span class="tag-item">#${tag}</span>`).join('');
  } else {
    tagsPreview.innerHTML = '';
  }
  
  // Show modal
  document.getElementById('previewModal').style.display = 'flex';
}

function hidePreview() {
  document.getElementById('previewModal').style.display = 'none';
}

function formatContent(content) {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/\n- (.*?)(?=\n|$)/g, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n/g, '<br>');
}

function setupAutoSave() {
  // Auto save every 30 seconds
  autoSaveInterval = setInterval(() => {
    saveDraft(false); // Silent save
  }, 30000);
}

function saveDraft(showToast = true) {
  const formData = getFormData();
  
  if (!formData.title.trim()) {
    if (showToast) {
      toast.warning('Vui lòng nhập tiêu đề bài viết để lưu nháp');
    }
    return;
  }
  
  const draftKey = editMode ? `draft_edit_${editBlogId}` : 'draft_new_blog';
  localStorage.setItem(draftKey, JSON.stringify(formData));
  
  if (showToast) {
    toast.success('Đã lưu bản nháp');
  }
}

function getFormData() {
  const tags = document.getElementById('tags').value.trim();
  
  return {
    title: document.getElementById('title').value.trim(),
    category: document.getElementById('category').value,
    summary: document.getElementById('summary').value.trim(),
    tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
    content: document.getElementById('content').value.trim(),
    image: selectedImage
  };
}

function setupForm() {
  const form = document.getElementById('blogForm');
  const saveDraftBtn = document.getElementById('saveDraftBtn');
  
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
  
  if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', () => saveDraft(true));
  }
  
  // Load draft if exists
  loadDraft();
}

function loadDraft() {
  const draftKey = editMode ? `draft_edit_${editBlogId}` : 'draft_new_blog';
  const draft = localStorage.getItem(draftKey);
  
  if (draft && !editMode) { // Only load draft for new posts
    try {
      const draftData = JSON.parse(draft);
      
      if (confirm('Có bản nháp chưa hoàn thành. Bạn có muốn khôi phục không?')) {
        document.getElementById('title').value = draftData.title || '';
        document.getElementById('category').value = draftData.category || '';
        document.getElementById('summary').value = draftData.summary || '';
        document.getElementById('tags').value = draftData.tags ? draftData.tags.join(', ') : '';
        document.getElementById('content').value = draftData.content || '';
        
        updateAllCounters();
        updateTagsPreview();
        
        toast.info('Đã khôi phục bản nháp');
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  
  const formData = getFormData();
  
  // Validation
  if (!formData.title.trim()) {
    toast.error('Vui lòng nhập tiêu đề bài viết');
    document.getElementById('title').focus();
    return;
  }
  
  if (!formData.category) {
    toast.error('Vui lòng chọn danh mục');
    document.getElementById('category').focus();
    return;
  }
  
  if (!formData.content.trim()) {
    toast.error('Vui lòng nhập nội dung bài viết');
    document.getElementById('content').focus();
    return;
  }
  
  // Show loading
  setButtonLoading('blogForm', true, editMode ? 'Đang cập nhật...' : 'Đang xuất bản...');
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const user = getCurrentUser();
    const blogData = {
      ...formData,
      authorId: user.id,
      authorName: user.fullName,
      createdAt: editMode ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    let result;
    if (editMode) {
      result = updateBlog(editBlogId, blogData);
    } else {
      result = createBlog(blogData);
    }
    
    if (result.success) {
      // Clear auto-save interval
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
      }
      
      // Clear draft
      const draftKey = editMode ? `draft_edit_${editBlogId}` : 'draft_new_blog';
      localStorage.removeItem(draftKey);
      
      toast.success(editMode ? 'Cập nhật bài viết thành công!' : 'Xuất bản bài viết thành công!');
      
      setTimeout(() => {
        window.location.href = `blog-detail.html?id=${result.blog.id}`;
      }, 1500);
    } else {
      toast.error(result.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    }
  } catch (error) {
    console.error('Submit error:', error);
    toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
  } finally {
    setButtonLoading('blogForm', false);
  }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
  }
});

  // Check if user is the author
  const user = getCurrentUser()
  if (user.id !== blog.author.id) {
    alert("Bạn không có quyền chỉnh sửa bài viết này")
    window.location.href = "blogs.html"
    return
  }

  // Update form title
  document.getElementById("formTitle").textContent = "Chỉnh sửa bài viết"

  // Fill form with blog data
  document.getElementById("title").value = blog.title
  document.getElementById("category").value = blog.category
  document.getElementById("content").value = blog.content

  if (blog.image) {
    selectedImage = blog.image
    displayImagePreview(blog.image)
  }

  // Update submit button text
  const submitBtn = document.querySelector('#blogForm button[type="submit"]')
  submitBtn.textContent = "Cập nhật bài viết"

function setupForm() {
  const form = document.getElementById("blogForm")
  const imageInput = document.getElementById("image")

  // Image upload handler
  imageInput.addEventListener("change", handleImageUpload)

  // Form submit handler
  form.addEventListener("submit", handleSubmit)
}

function handleImageUpload(e) {
  const file = e.target.files[0]

  if (!file) return

  // Validate file type
  if (!file.type.startsWith("image/")) {
    alert("Vui lòng chọn file ảnh")
    return
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert("Kích thước ảnh không được vượt quá 5MB")
    return
  }

  // Read and display image
  const reader = new FileReader()
  reader.onload = (event) => {
    selectedImage = event.target.result
    displayImagePreview(selectedImage)
  }
  reader.readAsDataURL(file)
}

function displayImagePreview(imageSrc) {
  const preview = document.getElementById("imagePreview")
  preview.innerHTML = `<img src="${imageSrc}" alt="Preview">`
}

function handleSubmit(e) {
  e.preventDefault()

  const title = document.getElementById("title").value.trim()
  const category = document.getElementById("category").value
  const content = document.getElementById("content").value.trim()
  const errorMessage = document.getElementById("errorMessage")

  // Validation
  if (!title || !category || !content) {
    errorMessage.textContent = "Vui lòng điền đầy đủ thông tin"
    return
  }

  const blogData = {
    title,
    category,
    content,
    image: selectedImage,
  }

  if (editMode) {
    // Update existing blog
    const updated = updateBlog(editBlogId, blogData)
    if (updated) {
      window.location.href = `blog-detail.html?id=${editBlogId}`
    } else {
      errorMessage.textContent = "Có lỗi xảy ra khi cập nhật bài viết"
    }
  } else {
    // Create new blog
    const newBlog = createBlog(blogData)
    window.location.href = `blog-detail.html?id=${newBlog.id}`
  }
}
