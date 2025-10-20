// // Authentication utilities
// const AUTH_KEY = "tech_blog_auth"
// const USERS_KEY = "tech_blog_users"

// // Get current user
// function getCurrentUser() {
//   const authData = localStorage.getItem(AUTH_KEY)
//   return authData ? JSON.parse(authData) : null
// }

// // Set current user
// function setCurrentUser(user) {
//   localStorage.setItem(AUTH_KEY, JSON.stringify(user))
// }

// // Logout
// function logout() {
//   localStorage.removeItem(AUTH_KEY)
//   window.location.href = "index.html"
// }

// // Get all users
// function getAllUsers() {
//   const users = localStorage.getItem(USERS_KEY)
//   return users ? JSON.parse(users) : []
// }

// // Save users
// function saveUsers(users) {
//   localStorage.setItem(USERS_KEY, JSON.stringify(users))
// }

// // Register user
// function registerUser(userData) {
//   const users = getAllUsers()

//   // Check if email already exists
//   if (users.find((u) => u.email === userData.email)) {
//     return { success: false, message: "Email đã được sử dụng" }
//   }

//   const newUser = {
//     id: Date.now().toString(),
//     fullName: userData.fullName,
//     email: userData.email,
//     password: userData.password, // In production, this should be hashed
//     createdAt: new Date().toISOString(),
//   }

//   users.push(newUser)
//   saveUsers(users)

//   return { success: true, user: newUser }
// }

// // Login user
// function loginUser(email, password) {
//   const users = getAllUsers()
//   const user = users.find((u) => u.email === email && u.password === password)

//   if (user) {
//     setCurrentUser(user)
//     return { success: true, user }
//   }

//   return { success: false, message: "Email hoặc mật khẩu không đúng" }
// }

// // Check authentication and update UI
// function checkAuth() {
//   const user = getCurrentUser()
//   const authButtons = document.getElementById("authButtons")
//   const userMenu = document.getElementById("userMenu")
//   const userName = document.getElementById("userName")
//   const logoutBtn = document.getElementById("logoutBtn")

//   if (user && authButtons && userMenu) {
//     authButtons.style.display = "none"
//     userMenu.style.display = "flex"
//     if (userName) {
//       userName.textContent = user.fullName
//     }

//     if (logoutBtn) {
//       logoutBtn.addEventListener("click", logout)
//     }
//   } else if (authButtons && userMenu) {
//     authButtons.style.display = "flex"
//     userMenu.style.display = "none"
//   }

//   return user
// }

// // Protect page (require authentication)
// function requireAuth() {
//   const user = getCurrentUser()
//   if (!user) {
//     window.location.href = "login.html"
//     return null
//   }
//   return user
// }

// // Initialize auth on page load
// document.addEventListener("DOMContentLoaded", () => {
//   checkAuth()
// })

// ===============================
// 🔐 AUTH UTILITIES (KẾT NỐI LARAVEL API)
// ===============================

const API_URL = "http://127.0.0.1:8000/api";
const TOKEN_KEY = "tech_blog_token";
const USER_KEY = "tech_blog_user";

// ========== TOKEN + USER STORAGE ==========

// Lưu user và token
function saveAuth(user, token) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
}

// Lấy token hiện tại
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// Lấy thông tin user hiện tại
function getCurrentUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

// Đăng xuất
async function logout() {
  const token = getToken();

  try {
    if (token) {
      // Gọi API Laravel để hủy token
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
    }
  } catch (error) {
    console.warn("Không thể logout trên server:", error);
  }

  // Xóa localStorage
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);

  alert("Bạn đã đăng xuất.");
  window.location.href = "login.html";
}

// Kiểm tra có đang đăng nhập không
function isLoggedIn() {
  return !!getToken();
}

// ========== API CALLS ==========

// Đăng ký
async function registerUser(userData) {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await res.json();

    if (res.ok) {
      saveAuth(data.user, data.token);
      return { success: true, user: data.user };
    } else {
      return { success: false, message: data.message || "Đăng ký thất bại" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Lỗi kết nối server" };
  }
}

// Đăng nhập
async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (res.ok) {
      saveAuth(data.user, data.token);
      return { success: true, user: data.user };
    } else {
      return { success: false, message: data.message || "Sai email hoặc mật khẩu" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Lỗi kết nối server" };
  }
}

// ========== UI MANAGEMENT ==========

function checkAuth() {
  const user = getCurrentUser();
  const authButtons = document.getElementById("authButtons");
  const userMenu = document.getElementById("userMenu");
  const userName = document.getElementById("userName");
  const logoutBtn = document.getElementById("logoutBtn");

  if (user && authButtons && userMenu) {
    authButtons.style.display = "none";
    userMenu.style.display = "flex";
    if (userName) userName.textContent = user.name || user.email;
    if (logoutBtn) logoutBtn.addEventListener("click", logout);
  } else if (authButtons && userMenu) {
    authButtons.style.display = "flex";
    userMenu.style.display = "none";
  }

  return user;
}

function requireAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = "login.html";
    return null;
  }
  return getCurrentUser();
}

document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
});

window.auth = {
  registerUser,
  loginUser,
  logout,
  isLoggedIn,
  getCurrentUser,
  checkAuth,
  requireAuth,
};
