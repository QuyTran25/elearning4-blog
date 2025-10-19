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

