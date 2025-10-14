document.addEventListener("DOMContentLoaded", () => {
  initializeSampleBlogs()
  loadFeaturedBlogs()
})

function initializeSampleBlogs() {
  // Placeholder for initializeSampleBlogs implementation
  console.log("Sample blogs initialized")
}

function getAllBlogs() {
  // Placeholder for getAllBlogs implementation
  return [
    {
      id: 1,
      title: "Blog 1",
      content: "Content of blog 1",
      category: "Category 1",
      author: { name: "Author 1" },
      createdAt: "2023-10-01",
      image: "image1.jpg",
    },
    {
      id: 2,
      title: "Blog 2",
      content: "Content of blog 2",
      category: "Category 2",
      author: { name: "Author 2" },
      createdAt: "2023-09-30",
      image: "image2.jpg",
    },
    {
      id: 3,
      title: "Blog 3",
      content: "Content of blog 3",
      category: "Category 3",
      author: { name: "Author 3" },
      createdAt: "2023-09-29",
      image: "image3.jpg",
    },
    {
      id: 4,
      title: "Blog 4",
      content: "Content of blog 4",
      category: "Category 4",
      author: { name: "Author 4" },
      createdAt: "2023-09-28",
      image: "image4.jpg",
    },
  ]
}

function sortBlogs(blogs, sortBy) {
  if (sortBy === "newest") {
    return blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
  // Placeholder for other sorting logic
  return blogs
}

function loadFeaturedBlogs() {
  const blogs = getAllBlogs()
  const featuredBlogs = sortBlogs(blogs, "newest").slice(0, 3)

  const container = document.getElementById("featuredBlogs")

  if (featuredBlogs.length === 0) {
    container.innerHTML = '<p class="no-blogs">Chưa có bài viết nào.</p>'
    return
  }

  container.innerHTML = featuredBlogs.map((blog) => createBlogCard(blog)).join("")
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
