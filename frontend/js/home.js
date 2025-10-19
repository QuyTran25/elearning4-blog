document.addEventListener("DOMContentLoaded", async () => {
  console.log('🚀 Initializing home page...')
  
  // Initialize sample blogs from blog-storage.js
  if (typeof initializeSampleBlogs === 'function') {
    await initializeSampleBlogs()
  }
  
  // Load and display featured blogs dynamically
  loadFeaturedBlogs()
  
  console.log('✅ Home page ready!')
})

function loadFeaturedBlogs() {
  const blogs = getAllBlogs()
  const container = document.querySelector('.featured-blogs .blog-grid')
  
  if (!container) {
    console.error('Blog grid container not found')
    return
  }
  
  if (blogs.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Chưa có bài viết nào</p>'
    return
  }
  
  // Sort by date, newest first
  const sortedBlogs = [...blogs].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.updatedAt)
    const dateB = new Date(b.createdAt || b.updatedAt)
    return dateB - dateA
  })
  
  // Take first 6 blogs for featured section (newest first, including sample blogs)
  const featuredBlogs = sortedBlogs.slice(0, 6)
  
  // Display featured blogs
  container.innerHTML = featuredBlogs.map(blog => createBlogCard(blog)).join('')
  
  console.log(`📌 Displaying ${featuredBlogs.length} featured blogs`)
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
  const date = new Date(blog.createdAt || blog.updatedAt).toLocaleDateString('vi-VN')
  const authorName = blog.author?.name || 'Ẩn danh'
  const excerpt = blog.summary || (blog.content ? blog.content.substring(0, 120) + '...' : 'Chưa có mô tả')
  const imageSrc = blog.image || 'image/mã code.jpg'
  
  return `
    <div class="blog-card fade-in-up ${category.class}" onclick="window.location.href='blog-detail.html?id=${blog.id}'" style="cursor: pointer;">
      <img src="${imageSrc}" alt="${blog.title}" class="blog-card-image" onerror="this.src='image/mã code.jpg'" />
      <div class="blog-card-content">
        <span class="blog-card-category ${category.class}">${category.name}</span>
        <h4 class="blog-card-title">${blog.title}</h4>
        <p class="blog-card-desc">${excerpt}</p>
        <div class="blog-card-meta">
          <span>Tác giả: ${authorName}</span> · <span>${date}</span>
        </div>
      </div>
    </div>
  `
}
