let currentBlogs = []

function searchBlogs(query) {
  // Get all blogs from blog-storage.js
  const allBlogs = getAllBlogs()
  
  // Implement search logic
  return allBlogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(query.toLowerCase()) ||
      (blog.content && blog.content.toLowerCase().includes(query.toLowerCase())) ||
      (blog.summary && blog.summary.toLowerCase().includes(query.toLowerCase())) ||
      (blog.category && blog.category.toLowerCase().includes(query.toLowerCase()))
  )
}

function sortBlogs(blogs, sortBy) {
  // Implement sort logic
  const sorted = [...blogs]
  switch (sortBy) {
    case "newest":
    case "date":
      return sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt)
        const dateB = new Date(b.createdAt || b.updatedAt)
        return dateB - dateA // Mới nhất trước
      })
    case "oldest":
      return sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt)
        const dateB = new Date(b.createdAt || b.updatedAt)
        return dateA - dateB // Cũ nhất trước
      })
    case "title":
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case "popular":
      // TODO: Implement popular sorting (for now, same as newest)
      return sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt)
        const dateB = new Date(b.createdAt || b.updatedAt)
        return dateB - dateA
      })
    default:
      return sorted
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log('🚀 Initializing blogs page...')
  
  // Initialize blogs from blog-storage.js
  if (typeof initializeSampleBlogs === 'function') {
    await initializeSampleBlogs()
  }
  
  loadBlogs()

  // Search functionality
  const searchBtn = document.getElementById("searchBtn")
  const searchInput = document.getElementById("searchInput")

  if (searchBtn) {
    searchBtn.addEventListener("click", handleSearch)
  }
  
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSearch()
      }
    })
  }

  // Sort functionality
  const sortSelect = document.getElementById("sortSelect")
  if (sortSelect) {
    sortSelect.addEventListener("change", handleSort)
  }
  
  // Category filter
  const categorySelect = document.getElementById("categorySelect")
  if (categorySelect) {
    categorySelect.addEventListener("change", handleCategoryFilter)
  }
  
  console.log('✅ Blogs page ready!')
})

function loadBlogs() {
  currentBlogs = getAllBlogs()
  displayBlogs(currentBlogs)
}

function displayBlogs(blogs) {
  const container = document.getElementById("blogsContainer")
  const noBlogs = document.getElementById("noBlogsMessage")

  if (blogs.length === 0) {
    container.innerHTML = ""
    noBlogs.style.display = "block"
    return
  }

  noBlogs.style.display = "none"
  container.innerHTML = blogs.map((blog) => createBlogCard(blog)).join("")
}

function createBlogCard(blog) {
  const categoryMap = {
    'javascript': { name: '🟡 JavaScript', class: 'coding' },
    'python': { name: '🐍 Python', class: 'coding' },
    'react': { name: '⚛️ React', class: 'fullstack' },
    'nodejs': { name: '🟢 Node.js', class: 'fullstack' },
    'css': { name: '🎨 CSS', class: 'coding' },
    'web-development': { name: '🌐 Web Dev', class: 'fullstack' },
    'mobile-development': { name: '📱 Mobile', class: 'fullstack' },
    'devops': { name: '🔧 DevOps', class: 'network' },
    'ai-ml': { name: '🤖 AI/ML', class: 'ai' },
    'database': { name: '💾 Database', class: 'network' },
    'tutorial': { name: '📚 Tutorial', class: 'coding' },
    'tips-tricks': { name: '💡 Tips', class: 'coding' },
    'other': { name: '❓ Khác', class: 'coding' }
  }
  
  const category = categoryMap[blog.category] || { name: blog.category, class: 'coding' }
  const excerpt = blog.summary || (blog.content ? blog.content.substring(0, 120) + '...' : 'Chưa có mô tả')
  const date = new Date(blog.createdAt || blog.updatedAt).toLocaleDateString("vi-VN")
  const authorName = blog.author?.name || 'Ẩn danh'
  const imageSrc = blog.image || 'image/mã code.jpg'

  return `
    <div class="blog-card fade-in-up ${category.class}" onclick="window.location.href='blog-detail.html?id=${blog.id}'" style="cursor: pointer;">
      <img src="${imageSrc}" alt="${blog.title}" class="blog-card-image" onerror="this.src='image/mã code.jpg'" />
      <div class="blog-card-content">
        <span class="blog-card-category ${category.class}">${category.name}</span>
        <h4 class="blog-card-title">${blog.title}</h4>
        <p class="blog-card-desc">${excerpt}</p>
        <div class="blog-card-meta">
          <span>${authorName}</span>
          <span>${date}</span>
        </div>
      </div>
    </div>
  `
}

function handleSearch() {
  const query = document.getElementById("searchInput").value.trim()

  if (query === "") {
    currentBlogs = getAllBlogs()
  } else {
    currentBlogs = searchBlogs(query)
  }

  const sortBy = document.getElementById("sortSelect").value
  currentBlogs = sortBlogs(currentBlogs, sortBy)

  displayBlogs(currentBlogs)
}

function handleSort() {
  const sortBy = document.getElementById("sortSelect").value
  currentBlogs = sortBlogs(currentBlogs, sortBy)
  displayBlogs(currentBlogs)
}

function handleCategoryFilter() {
  const category = document.getElementById("categorySelect").value
  const searchQuery = document.getElementById("searchInput").value.trim()
  
  // Get all blogs
  let filteredBlogs = getAllBlogs()
  
  // Apply search filter
  if (searchQuery !== "") {
    filteredBlogs = searchBlogs(searchQuery)
  }
  
  // Apply category filter
  if (category !== "") {
    filteredBlogs = filteredBlogs.filter(blog => blog.category === category)
  }
  
  // Apply sort
  const sortBy = document.getElementById("sortSelect").value
  currentBlogs = sortBlogs(filteredBlogs, sortBy)
  
  displayBlogs(currentBlogs)
}
