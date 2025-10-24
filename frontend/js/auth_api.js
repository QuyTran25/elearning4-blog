// AUTH API - ADMIN LOGIN
const API_URL = "http://127.0.0.1:8000/api";
const TOKEN_KEY = "admin_token";
const USER_KEY = "admin_user";
const ROLE_KEY = "admin_role";

function saveAuth(user, token) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, user.role);
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getCurrentUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

function getRole() {
  return localStorage.getItem(ROLE_KEY);
}

function isAdmin() {
  return getRole() === "admin" && getToken() !== null;
}

function clearAuth() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}

async function loginAdmin(email, password) {
  try {
    const res = await fetch(API_URL + "/login", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      saveAuth(data.user, data.token);
      return { success: true, user: data.user };
    } else {
      return { success: false, message: data.message || "Đăng nhập thất bại" };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Lỗi kết nối server" };
  }
}

async function logoutAdmin() {
  // Hiển thị hộp thoại xác nhận đơn giản
  if (!confirm("Bạn có chắc chắn muốn đăng xuất?")) {
    return; // Người dùng chọn Cancel
  }
  
  const token = getToken();
  try {
    if (token) {
      await fetch(API_URL + "/logout", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json"
        }
      });
    }
  } catch (error) {
    console.warn("Logout API error:", error);
  }
  
  clearAuth();
  alert("Đăng xuất thành công!");
  window.location.href = "index.html";
}

function checkAuth() {
  const authButtons = document.getElementById("authButtons");
  const userMenu = document.getElementById("userMenu");
  const logoutBtn = document.getElementById("logoutBtn");
  
  if (isAdmin()) {
    if (authButtons) authButtons.style.display = "none";
    if (userMenu) userMenu.style.display = "flex";
    
    if (logoutBtn) {
      // Xóa tất cả event listeners cũ bằng cách clone node
      const newLogoutBtn = logoutBtn.cloneNode(true);
      logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
      
      // Thêm event listener mới
      newLogoutBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        logoutAdmin();
      };
    }
  } else {
    if (authButtons) authButtons.style.display = "flex";
    if (userMenu) userMenu.style.display = "none";
  }
  
  return isAdmin();
}

function requireAdmin() {
  if (!isAdmin()) {
    alert("Chỉ admin mới có quyền truy cập trang này!");
    window.location.href = "login.html";
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", function() {
  console.log('🔍 Checking auth status...');
  console.log('Token exists:', !!getToken());
  console.log('Is admin:', isAdmin());
  checkAuth();
  console.log('✅ Auth check completed');
});