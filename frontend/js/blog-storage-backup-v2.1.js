// Blog storage utilities - SIMPLIFIED VERSION
const BLOGS_KEY = "tech_blog_posts"
const BLOG_VERSION_KEY = "tech_blog_version"
const CURRENT_VERSION = "2.1" // Version 2.1: Always keep sample blogs + user blogs

// Note: getCurrentUser is now defined in auth.js
// We don't redefine it here to avoid conflicts

// Get all blogs
function getAllBlogs() {
  const blogs = localStorage.getItem(BLOGS_KEY)
  return blogs ? JSON.parse(blogs) : []
}

// Save blogs
function saveBlogs(blogs) {
  localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs))
}

// Get blog by ID
function getBlogById(id) {
  const blogs = getAllBlogs()
  return blogs.find((blog) => blog.id === id)
}

// Create blog
function createBlog(blogData) {
  const blogs = getAllBlogs()
  const user = getCurrentUser()

  const newBlog = {
    id: Date.now().toString(),
    title: blogData.title,
    category: blogData.category,
    content: blogData.content,
    image: blogData.image || null,
    author: {
      id: user.id,
      name: user.fullName,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  blogs.push(newBlog)
  saveBlogs(blogs)

  return newBlog
}

// Update blog
function updateBlog(id, blogData) {
  const blogs = getAllBlogs()
  const index = blogs.findIndex((blog) => blog.id === id)

  if (index === -1) {
    return null
  }

  blogs[index] = {
    ...blogs[index],
    title: blogData.title,
    category: blogData.category,
    content: blogData.content,
    image: blogData.image !== undefined ? blogData.image : blogs[index].image,
    updatedAt: new Date().toISOString(),
  }

  saveBlogs(blogs)
  return blogs[index]
}

// Delete blog
function deleteBlog(id) {
  const blogs = getAllBlogs()
  const filteredBlogs = blogs.filter((blog) => blog.id !== id)
  saveBlogs(filteredBlogs)
  return true
}

// Search blogs
function searchBlogs(query) {
  const blogs = getAllBlogs()
  const lowerQuery = query.toLowerCase()

  return blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(lowerQuery) ||
      blog.content.toLowerCase().includes(lowerQuery) ||
      blog.category.toLowerCase().includes(lowerQuery),
  )
}

// Sort blogs
function sortBlogs(blogs, sortBy) {
  const sorted = [...blogs]

  switch (sortBy) {
    case "newest":
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case "oldest":
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    case "title":
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return sorted
  }
}

// Load blog content from external HTML file
async function loadBlogContent(blogId) {
  try {
    const response = await fetch(`blog-content/blog-${blogId}-${getBlogSlug(blogId)}.html`)
    if (!response.ok) {
      throw new Error('Blog content not found')
    }
    return await response.text()
  } catch (error) {
    console.error('Error loading blog content:', error)
    return '<p>Không thể tải nội dung blog. Vui lòng thử lại sau.</p>'
  }
}

// Get blog slug from ID
function getBlogSlug(blogId) {
  const slugs = {
    '1': 'ai',
    '2': 'fullstack',
    '3': 'clean-code',
    '4': 'iot',
    '5': 'machine-learning',
    '6': 'nodejs'
  }
  return slugs[blogId] || 'unknown'
}

// Initialize with sample data if empty
async function initializeSampleBlogs() {
  const blogs = getAllBlogs()
  const storedVersion = localStorage.getItem(BLOG_VERSION_KEY)
  
  // Check if sample blogs (IDs 1-6) exist
  const hasSampleBlogs = blogs.some(blog => ['1', '2', '3', '4', '5', '6'].includes(blog.id))

  // If version changed OR sample blogs missing, reload them
  if (storedVersion !== CURRENT_VERSION || !hasSampleBlogs) {
    console.log('� Reloading sample blogs (version ' + CURRENT_VERSION + ')...')
    
    // Load content for all 6 blogs
    const blog1Content = await loadBlogContent('1')
    const blog2Content = await loadBlogContent('2')
    const blog3Content = await loadBlogContent('3')
    const blog4Content = await loadBlogContent('4')
    const blog5Content = await loadBlogContent('5')
    const blog6Content = await loadBlogContent('6')

    const sampleBlogs = [
      {
        id: "1",
        title: "AI giúp nhận diện hình ảnh",
        category: "ai-ml",
        content: blog1Content,
        summary: "Khám phá cách trí tuệ nhân tạo thay đổi cuộc sống: từ nhận diện khuôn mặt, y tế thông minh đến trợ lý ảo và tự động hóa.",
        tags: ["AI", "Machine Learning", "Computer Vision"],
        image: "image/AI.jpg",
        author: { id: "user1", name: "Minh Khoa" },
        createdAt: "2025-10-14T00:00:00.000Z",
        updatedAt: "2025-10-14T00:00:00.000Z",
      },
      {
        id: "2",
        title: "Lộ trình học lập trình web",
        category: "web-development",
        content: blog2Content,
        summary: "Hướng dẫn chi tiết từ HTML/CSS, JavaScript, framework frontend, backend Node.js đến kiến thức DevOps căn bản.",
        tags: ["Web Development", "Fullstack", "Tutorial"],
        image: "image/học fullstacsk.jpg",
        author: { id: "user2", name: "Bảo Trâm" },
        createdAt: "2025-10-10T00:00:00.000Z",
        updatedAt: "2025-10-10T00:00:00.000Z",
      },
      {
        id: "3",
        title: "5 mẹo code sạch cho người mới",
        category: "tips-tricks",
        content: blog3Content,
        summary: "Đặt tên biến rõ ràng, chia nhỏ hàm, comment hợp lý và kiểm thử tự động - bí quyết viết code dễ đọc dễ bảo trì.",
        tags: ["Clean Code", "Best Practices", "Tips"],
        image: "image/mã code.jpg",
        author: { id: "user3", name: "Hữu Phước" },
        createdAt: "2025-10-05T00:00:00.000Z",
        updatedAt: "2025-10-05T00:00:00.000Z",
      },
      {
        id: "4",
        title: "Internet of Things là gì?",
        category: "other",
        content: blog4Content,
        summary: "IoT kết nối thiết bị thông minh, giúp tự động hóa nhà cửa và tối ưu sản xuất công nghiệp.",
        tags: ["IoT", "Smart Home", "Technology"],
        image: "image/mạng toàn cầu.jpg",
        author: { id: "user4", name: "Thanh Tùng" },
        createdAt: "2025-10-01T00:00:00.000Z",
        updatedAt: "2025-10-01T00:00:00.000Z",
      },
      {
        id: "5",
        title: "Machine Learning cơ bản",
        category: "ai-ml",
        content: blog5Content,
        summary: "Giới thiệu về học máy, các thuật toán phổ biến và ứng dụng thực tế trong doanh nghiệp.",
        tags: ["Machine Learning", "AI", "Data Science"],
        image: "image/AI.jpg",
        author: { id: "user5", name: "Đức Anh" },
        createdAt: "2025-10-08T00:00:00.000Z",
        updatedAt: "2025-10-08T00:00:00.000Z",
      },
      {
        id: "6",
        title: "Node.js và Express cho backend",
        category: "nodejs",
        content: blog6Content,
        summary: "Xây dựng RESTful API với Node.js, Express, kết nối database và authentication.",
        tags: ["Node.js", "Express", "Backend"],
        image: "image/học fullstacsk.jpg",
        author: { id: "user6", name: "Quang Huy" },
        createdAt: "2025-10-03T00:00:00.000Z",
        updatedAt: "2025-10-03T00:00:00.000Z",
      },
    ]

    // Keep user-created blogs (IDs that are NOT 1-6)
    const existingUserBlogs = blogs.filter(blog => !['1', '2', '3', '4', '5', '6'].includes(blog.id))
    
    // Merge: sample blogs first, then user blogs
    const mergedBlogs = [...sampleBlogs, ...existingUserBlogs]
    
    saveBlogs(mergedBlogs)
    localStorage.setItem(BLOG_VERSION_KEY, CURRENT_VERSION)
    
    console.log('✅ Loaded ' + sampleBlogs.length + ' sample blogs + ' + existingUserBlogs.length + ' user blogs!')
  } else {
    console.log('✅ Blogs already loaded (' + blogs.length + ' total blogs)')
  }
}
