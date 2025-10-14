// Authentication utilities
const AUTH_KEY = "tech_blog_auth"
const USERS_KEY = "tech_blog_users"

// Get current user
function getCurrentUser() {
  const authData = localStorage.getItem(AUTH_KEY)
  return authData ? JSON.parse(authData) : null
}

// Set current user
function setCurrentUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
}

// Logout
function logout() {
  localStorage.removeItem(AUTH_KEY)
  window.location.href = "index.html"
}

// Get all users
function getAllUsers() {
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : []
}

// Save users
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// Register user
function registerUser(userData) {
  const users = getAllUsers()

  // Check if email already exists
  if (users.find((u) => u.email === userData.email)) {
    return { success: false, message: "Email đã được sử dụng" }
  }

  const newUser = {
    id: Date.now().toString(),
    fullName: userData.fullName,
    email: userData.email,
    password: userData.password, // In production, this should be hashed
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)

  return { success: true, user: newUser }
}

// Login user
function loginUser(email, password) {
  const users = getAllUsers()
  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    setCurrentUser(user)
    return { success: true, user }
  }

  return { success: false, message: "Email hoặc mật khẩu không đúng" }
}

// Check authentication and update UI
function checkAuth() {
  const user = getCurrentUser()
  const authButtons = document.getElementById("authButtons")
  const userMenu = document.getElementById("userMenu")
  const userName = document.getElementById("userName")
  const logoutBtn = document.getElementById("logoutBtn")

  if (user && authButtons && userMenu) {
    authButtons.style.display = "none"
    userMenu.style.display = "flex"
    if (userName) {
      userName.textContent = user.fullName
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", logout)
    }
  } else if (authButtons && userMenu) {
    authButtons.style.display = "flex"
    userMenu.style.display = "none"
  }

  return user
}

// Protect page (require authentication)
function requireAuth() {
  const user = getCurrentUser()
  if (!user) {
    window.location.href = "login.html"
    return null
  }
  return user
}

// Initialize auth on page load
document.addEventListener("DOMContentLoaded", () => {
  checkAuth()
})
