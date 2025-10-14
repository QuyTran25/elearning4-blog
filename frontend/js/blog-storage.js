// Blog storage utilities
const BLOGS_KEY = "tech_blog_posts"

// Function to get the current user
function getCurrentUser() {
  // Placeholder for user retrieval logic
  return { id: "admin", fullName: "Admin" }
}

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

// Initialize with sample data if empty
function initializeSampleBlogs() {
  const blogs = getAllBlogs()

  if (blogs.length === 0) {
    const sampleBlogs = [
      {
        id: "1",
        title: "Giới thiệu về React Hooks",
        category: "JavaScript",
        content:
          "React Hooks là một tính năng mới trong React 16.8 cho phép bạn sử dụng state và các tính năng khác của React mà không cần viết class component.\n\nHooks giúp code của bạn ngắn gọn hơn, dễ đọc hơn và dễ test hơn. Các hooks phổ biến nhất là useState và useEffect.\n\nuseState cho phép bạn thêm state vào functional component, trong khi useEffect cho phép bạn thực hiện side effects như fetch data, subscriptions, hoặc thay đổi DOM.",
        image: "/react-hooks-code.png",
        author: { id: "admin", name: "Admin" },
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "2",
        title: "Python cho Data Science",
        category: "Python",
        content:
          "Python đã trở thành ngôn ngữ lập trình phổ biến nhất cho Data Science và Machine Learning.\n\nVới các thư viện mạnh mẽ như NumPy, Pandas, Matplotlib và Scikit-learn, Python cung cấp một hệ sinh thái hoàn chỉnh cho phân tích dữ liệu.\n\nPandas giúp xử lý và phân tích dữ liệu dễ dàng với DataFrame. NumPy cung cấp các phép toán số học hiệu quả. Matplotlib và Seaborn giúp visualize dữ liệu một cách trực quan.",
        image: "/python-data-science.png",
        author: { id: "admin", name: "Admin" },
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: "3",
        title: "Xây dựng RESTful API với Node.js",
        category: "Web Development",
        content:
          "RESTful API là một kiến trúc phổ biến để xây dựng web services. Node.js với Express.js là một lựa chọn tuyệt vời để xây dựng API.\n\nCác nguyên tắc REST bao gồm: sử dụng HTTP methods đúng cách (GET, POST, PUT, DELETE), stateless communication, và resource-based URLs.\n\nExpress.js cung cấp routing mạnh mẽ, middleware system linh hoạt, và dễ dàng tích hợp với các database như MongoDB, PostgreSQL.",
        image: "/nodejs-api-development.png",
        author: { id: "admin", name: "Admin" },
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      },
    ]

    saveBlogs(sampleBlogs)
  }
}
