// Main JavaScript file for common functionality

// Toast Notification System
class ToastManager {
  constructor() {
    this.container = document.getElementById('toastContainer');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toastContainer';
      document.body.appendChild(this.container);
    }
  }

  show(message, type = 'success', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = this.getIcon(type);
    toast.innerHTML = `${icon} ${message}`;
    
    this.container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (this.container.contains(toast)) {
          this.container.removeChild(toast);
        }
      }, 300);
    }, duration);
    
    return toast;
  }
  
  getIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  }
  
  success(message, duration) {
    return this.show(message, 'success', duration);
  }
  
  error(message, duration) {
    return this.show(message, 'error', duration);
  }
  
  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }
  
  info(message, duration) {
    return this.show(message, 'info', duration);
  }
}

// Create global toast instance
window.toast = new ToastManager();

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
      }
    });
  }
  
  // Add animation classes to elements
  const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in, .slide-in-right');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    if (el.classList.contains('fade-in-up')) {
      el.style.transform = 'translateY(30px)';
    }
    observer.observe(el);
  });

  // --- Blog Filter by Technology ---
  // Define mapping from category to blog card class
  const categoryMap = {
    AI: 'ai',
    Fullstack: 'fullstack',
    Coding: 'coding',
    Network: 'network'
  };

  // Get all tech image cards
  const techCards = document.querySelectorAll('.tech-image-card');
  // Get all blog cards
  const blogCards = document.querySelectorAll('.blog-card');

  techCards.forEach(card => {
    card.addEventListener('click', function() {
      const category = card.getAttribute('data-category');
      if (!category || !categoryMap[category]) return;

      // Highlight selected tech card
      techCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      // Show only blog cards matching category
      blogCards.forEach(blog => {
        if (blog.classList.contains(categoryMap[category])) {
          blog.style.display = '';
        } else {
          blog.style.display = 'none';
        }
      });
    });
  });

  // Add a button to reset filter (show all)
  const techGrid = document.querySelector('.tech-image-grid');
  if (techGrid) {
    let resetBtn = document.createElement('button');
    resetBtn.textContent = 'Hiện tất cả bài viết';
    resetBtn.className = 'btn btn-secondary tech-reset-btn';
    resetBtn.style.margin = '16px 0 0 0';
    techGrid.parentElement.appendChild(resetBtn);
    resetBtn.addEventListener('click', function() {
      techCards.forEach(c => c.classList.remove('active'));
      blogCards.forEach(blog => {
        blog.style.display = '';
      });
    });
  }
});

// Google Sign-In Configuration
window.onload = function() {
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.initialize({
      client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with actual client ID
      callback: handleGoogleSignIn
    });
  }
};

// Handle Google Sign-In
function handleGoogleSignIn(response) {
  try {
    // Decode the JWT token to get user info
    const userInfo = JSON.parse(atob(response.credential.split('.')[1]));
    
    // Create user object
    const user = {
      id: userInfo.sub,
      fullName: userInfo.name,
      email: userInfo.email,
      avatar: userInfo.picture,
      provider: 'google'
    };
    
    // Save user to localStorage (in production, send to backend)
    setCurrentUser(user);
    
    // Show success message
    toast.success(`Chào mừng ${user.fullName}! Đăng nhập thành công.`);
    
    // Redirect to home page
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
    
  } catch (error) {
    console.error('Google Sign-In error:', error);
    toast.error('Đăng nhập Google thất bại. Vui lòng thử lại.');
  }
}

// Form Validation Utilities
class FormValidator {
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  static isValidPassword(password) {
    return password && password.length >= 6;
  }
  
  static showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.style.borderColor = 'var(--danger-color)';
      
      // Remove existing error
      const existingError = field.parentElement.querySelector('.field-error');
      if (existingError) {
        existingError.remove();
      }
      
      // Add new error
      const errorDiv = document.createElement('div');
      errorDiv.className = 'field-error';
      errorDiv.style.color = 'var(--danger-color)';
      errorDiv.style.fontSize = '0.85rem';
      errorDiv.style.marginTop = '0.5rem';
      errorDiv.textContent = message;
      
      field.parentElement.appendChild(errorDiv);
    }
  }
  
  static clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.style.borderColor = '';
      const errorDiv = field.parentElement.querySelector('.field-error');
      if (errorDiv) {
        errorDiv.remove();
      }
    }
  }
  
  static clearAllErrors() {
    const errorDivs = document.querySelectorAll('.field-error');
    errorDivs.forEach(div => div.remove());
    
    const fields = document.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
      field.style.borderColor = '';
    });
  }
}

// Loading Button Utility
function setButtonLoading(buttonId, isLoading, loadingText = 'Đang xử lý...') {
  const button = document.getElementById(buttonId);
  if (!button) return;
  
  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.innerHTML = `<span class="loading"></span> ${loadingText}`;
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText || button.textContent;
  }
}

// Initialize Google Sign-In button
document.addEventListener('DOMContentLoaded', function() {
  const googleSignInBtn = document.getElementById('googleSignInBtn');
  
  if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', function() {
      if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.prompt();
      } else {
        toast.warning('Google Sign-In chưa sẵn sàng. Vui lòng thử lại sau.');
      }
    });
  }
});

// Utility Functions
const Utils = {
  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },
  
  formatRelativeTime: (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Hôm nay';
    } else if (diffInDays === 1) {
      return 'Hôm qua';
    } else if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    } else {
      return Utils.formatDate(dateString);
    }
  },
  
  truncateText: (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  },
  
  debounce: (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }
};

// Export utilities for use in other files
window.FormValidator = FormValidator;
window.setButtonLoading = setButtonLoading;
window.Utils = Utils;

// Blog demo data for detail page
window.getBlogById = function(id) {
  // Demo data giống blogs.js
  const blogs = [
    {
      id: "1",
      title: "AI trong cuộc sống hiện đại: Từ giấc mơ đến thực tế",
      content: `
        <h2>AI là gì?</h2>
        <p>Trí tuệ nhân tạo (AI) là lĩnh vực công nghệ giúp máy móc có khả năng học hỏi, phân tích và đưa ra quyết định như con người. AI đã và đang thay đổi cách chúng ta sống, làm việc và giải trí.</p>
        <h3>Ứng dụng AI nổi bật</h3>
        <ul>
          <li><strong>Nhận diện khuôn mặt:</strong> Sử dụng trong điện thoại, camera an ninh, mạng xã hội.</li>
          <li><strong>Xe tự lái:</strong> AI giúp xe nhận biết vật cản, biển báo, người đi bộ.</li>
          <li><strong>Y tế thông minh:</strong> AI hỗ trợ chẩn đoán bệnh, phân tích hình ảnh y khoa.</li>
          <li><strong>Chatbot & trợ lý ảo:</strong> Giúp doanh nghiệp chăm sóc khách hàng 24/7.</li>
        </ul>
        <img src="image/AI.jpg" alt="AI ứng dụng" style="width:100%;max-width:500px;border-radius:12px;margin:2rem auto;display:block;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <h3>Lợi ích và thách thức</h3>
        <p><strong>Lợi ích:</strong> Tăng hiệu suất, giảm chi phí, mở ra nhiều dịch vụ mới.<br><strong>Thách thức:</strong> Bảo mật dữ liệu, đạo đức AI, nguy cơ mất việc làm truyền thống.</p>
        <blockquote style="background:#f5f7fa;padding:1rem 2rem;border-left:4px solid #764ba2;margin:2rem 0;font-style:italic;">“AI không thay thế con người, mà giúp con người làm việc thông minh hơn.”</blockquote>
        <h3>Kết luận</h3>
        <p>AI đang từng bước trở thành một phần không thể thiếu trong cuộc sống hiện đại. Việc hiểu và ứng dụng AI sẽ giúp chúng ta thích nghi tốt hơn với thế giới số hóa.</p>
      `,
      createdAt: "2025-10-16",
      category: "Technology",
      author: { id: "user1", name: "Minh Khoa" },
      image: "image/AI.jpg",
    },
    {
      id: "2",
      title: "Lộ trình học lập trình web cho người mới bắt đầu",
      content: `<p>Đây là nội dung chi tiết của Sample Blog 2. <br>Blog này nói về lộ trình học lập trình fullstack, các bước cơ bản để trở thành lập trình viên toàn diện: HTML, CSS, JS, backend và DevOps.</p>`,
      createdAt: "2023-09-15",
      category: "Science",
      author: { id: "user2", name: "Author 2" },
      image: "image/học fullstacsk.jpg",
    }
  ];
  return blogs.find(b => b.id == id);
}

// Override getBlogById if blog-storage.js is loaded
document.addEventListener('DOMContentLoaded', function() {
  if (typeof getAllBlogs === 'function') {
    window.getBlogById = function(id) {
      const blogs = getAllBlogs();
      return blogs.find(b => b.id == id);
    };
    
    // Initialize sample blogs
    if (typeof initializeSampleBlogs === 'function') {
      initializeSampleBlogs();
    }
  }
  
  // Export deleteBlog if available
  if (typeof deleteBlog === 'function') {
    window.deleteBlog = deleteBlog;
  }
});
