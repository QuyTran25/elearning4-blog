let currentBlogId = null

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search)
  currentBlogId = urlParams.get("id")

  if (!currentBlogId) {
    window.location.href = "blogs.html"
    return
  }

  loadBlogDetail()
  setupDeleteModal()
})

function loadBlogDetail() {
  const loadingState = document.getElementById("loadingState")
  const emptyState = document.getElementById("emptyState")
  const container = document.getElementById("blogDetail")

  loadingState.classList.remove("hidden")
  emptyState.classList.add("hidden")
  container.style.display = "none"

  setTimeout(async () => {
    console.log('🔍 Loading blog detail for ID:', currentBlogId)
    
    // Ensure blogs are initialized
    if (typeof initializeSampleBlogs === 'function') {
      await initializeSampleBlogs()
    }

    const blog = window.getBlogById(currentBlogId)
    loadingState.classList.add("hidden")
    
    if (!blog) {
      console.error('❌ Blog not found:', currentBlogId)
      emptyState.classList.remove("hidden")
      container.style.display = "none"
      return
    }
    
    console.log('✅ Blog loaded:', blog.title)
    emptyState.classList.add("hidden")
    container.style.display = "block"

    const currentUser = window.getCurrentUser && window.getCurrentUser()
    const isAuthor = currentUser && currentUser.id === blog.author.id
    const date = new Date(blog.createdAt).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    container.innerHTML = `
      <div class="blog-detail-header">
        <h1 class="blog-detail-title">${blog.title}</h1>
        <div class="blog-detail-meta">
          <span>Tác giả: <strong>${blog.author.name}</strong></span>
          <span>Danh mục: <strong>${blog.category}</strong></span>
          <span>Ngày đăng: <strong>${date}</strong></span>
        </div>
        ${
          isAuthor
            ? `<div class="blog-detail-actions">
                <a href="create-blog.html?id=${blog.id}" class="btn btn-primary">Chỉnh sửa</a>
                <button onclick="showDeleteModal()" class="btn btn-danger">Xóa bài viết</button>
              </div>`
            : ""
        }
      </div>
      ${blog.image ? `<img src="${blog.image}" alt="${blog.title}" class="blog-detail-image">` : ""}
      <div class="blog-detail-content">${blog.content}</div>
    `
  }, 600)
}

function showDeleteModal() {
  const modal = document.getElementById("deleteModal")
  modal.classList.add("active")
}

function hideDeleteModal() {
  const modal = document.getElementById("deleteModal")
  modal.classList.remove("active")
}

function setupDeleteModal() {
  const confirmBtn = document.getElementById("confirmDelete")
  const cancelBtn = document.getElementById("cancelDelete")

  confirmBtn.addEventListener("click", () => {
    window.deleteBlog(currentBlogId)
    window.location.href = "blogs.html"
  })

  cancelBtn.addEventListener("click", hideDeleteModal)

  // Close modal when clicking outside
  const modal = document.getElementById("deleteModal")
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      hideDeleteModal()
    }
  })
}
