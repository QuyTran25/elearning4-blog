const isLoggedIn = localStorage.getItem("loggedIn") === "true";
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const logoutBtn = document.getElementById("logout-btn");

// Ẩn/hiện nút tùy trạng thái đăng nhập
if (isLoggedIn) {
  loginBtn.style.display = "none";
  registerBtn.style.display = "none";
  logoutBtn.style.display = "inline-block";
} else {
  loginBtn.style.display = "inline-block";
  registerBtn.style.display = "inline-block";
  logoutBtn.style.display = "none";
}

// Đăng xuất
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
});

// Nút tạo bài viết
const createPostBtn = document.getElementById("create-post-btn");
createPostBtn.addEventListener("click", () => {
  if (isLoggedIn) {
    window.location.href = "post.html";
  } else {
    alert("Bạn cần đăng nhập trước khi tạo bài viết!");
    window.location.href = "login.html";
  }
});

// === CHỨC NĂNG TÌM KIẾM BÀI VIẾT ===
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search-box input");
  const postCards = document.querySelectorAll(".post-card");
  const featuredSection = document.querySelector(".featured");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const keyword = searchInput.value.trim().toLowerCase();

      if (keyword === "") {
        featuredSection.style.display = "flex";
        postCards.forEach(card => (card.style.display = "block"));
        return;
      }

      featuredSection.style.display = "none";
      let found = false;

      postCards.forEach(card => {
        const title = card.querySelector("h2").textContent.toLowerCase();
        const desc = card.querySelector("p").textContent.toLowerCase();

        if (title.includes(keyword) || desc.includes(keyword)) {
          card.style.display = "block";
          found = true;
        } else {
          card.style.display = "none";
        }
      });

      if (!found) console.log("Không tìm thấy bài nào phù hợp.");
    });
  }
});

// === XỬ LÝ CLICK MỞ CHI TIẾT BÀI VIẾT ===
document.addEventListener("DOMContentLoaded", () => {
  const postCards = document.querySelectorAll(".post-card");

  postCards.forEach(card => {
    card.addEventListener("click", () => {
      const imgSrc = card.querySelector("img").src;
      const title = card.querySelector("h2").textContent.trim();
      const content = card.querySelector("p").textContent.trim();
      const meta = card.querySelector("span").textContent.trim();

      localStorage.setItem("postImage", imgSrc);
      localStorage.setItem("postTitle", title);
      localStorage.setItem("postContent", content);
      localStorage.setItem("postMeta", meta);

      window.location.href = "blog-detail.html";
    });
  });
});

// === LỌC THEO CHỦ ĐỀ ===
document.addEventListener("DOMContentLoaded", () => {
  const categoryLinks = document.querySelectorAll(".sidebar nav a");
  const posts = document.querySelectorAll(".post-card");
  const featuredSection = document.querySelector(".featured");

  categoryLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      categoryLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      const category = link.textContent.trim();
      featuredSection.style.display = category === "Tất cả" ? "flex" : "none";

      posts.forEach(post => {
        const topic = post.querySelector("span b").textContent.trim();
        post.style.display = (category === "Tất cả" || topic === category) ? "block" : "none";
      });
    });
  });
});
