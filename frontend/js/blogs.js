let currentBlogs = []

// Declare the missing functions
function initializeSampleBlogs() {
  // Sample implementation
  currentBlogs = [
    {
      id: 1,
      title: "Sample Blog 1",
      content: "This is the content of sample blog 1.",
      createdAt: "2023-10-01",
      category: "Technology",
      author: { name: "Author 1" },
      image: "image1.jpg",
    },
    {
      id: 2,
      title: "Sample Blog 2",
      content: "This is the content of sample blog 2.",
      createdAt: "2023-09-15",
      category: "Science",
      author: { name: "Author 2" },
      image: "image2.jpg",
    },
    // Add more sample blogs as needed
  ]
}

function getAllBlogs() {
  // Return all blogs
  return currentBlogs
}

function searchBlogs(query) {
  // Implement search logic
  return currentBlogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(query.toLowerCase()) ||
      blog.content.toLowerCase().includes(query.toLowerCase()),
  )
}

function sortBlogs(blogs, sortBy) {
  // Implement sort logic
  switch (sortBy) {
    case "date":
      return blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case "title":
      return blogs.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return blogs
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeSampleBlogs()
  loadBlogs()

  // Search functionality
  const searchBtn = document.getElementById("searchBtn")
  const searchInput = document.getElementById("searchInput")

  searchBtn.addEventListener("click", handleSearch)
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  })

  // Sort functionality
  const sortSelect = document.getElementById("sortSelect")
  sortSelect.addEventListener("change", handleSort)
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
  const excerpt = blog.content.substring(0, 150) + "..."
  const date = new Date(blog.createdAt).toLocaleDateString("vi-VN")

  return `
        <div class="blog-card" onclick="window.location.href='blog-detail.html?id=${blog.id}'">
            ${blog.image ? `<img src="${blog.image}" alt="${blog.title}" class="blog-card-image">` : ""}
            <div class="blog-card-content">
                <span class="blog-card-category">${blog.category}</span>
                <h4 class="blog-card-title">${blog.title}</h4>
                <p class="blog-card-excerpt">${excerpt}</p>
                <div class="blog-card-meta">
                    <span>${blog.author.name}</span>
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
