document.addEventListener("DOMContentLoaded", () => {
  // Redirect if already logged in
  if (getCurrentUser()) {
    window.location.href = "index.html";
    return;
  }

  const loginForm = document.getElementById("loginForm");
  const errorMessage = document.getElementById("errorMessage");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const rememberMeCheckbox = document.getElementById("rememberMe");
  const forgotPasswordLink = document.getElementById("forgotPassword");

  // Clear errors when typing
  emailInput?.addEventListener('input', () => {
    FormValidator.clearFieldError('email');
    errorMessage.textContent = '';
  });

  passwordInput?.addEventListener('input', () => {
    FormValidator.clearFieldError('password');
    errorMessage.textContent = '';
  });

  // Enhanced login function that works with localStorage
  const loginUser = (email, password) => {
    const users = getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      return { success: true, user };
    } else {
      return { 
        success: false, 
        message: "Email hoặc mật khẩu không đúng. Vui lòng thử lại." 
      };
    }
  };

  // Handle form submission
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    FormValidator.clearAllErrors();
    errorMessage.textContent = '';

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const rememberMe = rememberMeCheckbox?.checked || false;

    // Validation
    let hasError = false;

    if (!email) {
      FormValidator.showFieldError('email', 'Vui lòng nhập email');
      hasError = true;
    } else if (!FormValidator.isValidEmail(email)) {
      FormValidator.showFieldError('email', 'Định dạng email không hợp lệ');
      hasError = true;
    }

    if (!password) {
      FormValidator.showFieldError('password', 'Vui lòng nhập mật khẩu');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Show loading state
    setButtonLoading('loginForm', true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = loginUser(email, password);

      if (result.success) {
        // Store user data
        setCurrentUser(result.user);
        
        // Handle remember me
        if (rememberMe) {
          localStorage.setItem('rememberLogin', 'true');
        }

        toast.success(`Chào mừng ${result.user.fullName}! Đăng nhập thành công.`);
        
        // Redirect after short delay
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
        
      } else {
        errorMessage.textContent = result.message;
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      errorMessage.textContent = 'Có lỗi xảy ra. Vui lòng thử lại.';
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setButtonLoading('loginForm', false);
    }
  });

  // Handle forgot password
  forgotPasswordLink?.addEventListener('click', (e) => {
    e.preventDefault();
    toast.info('Tính năng quên mật khẩu đang được phát triển. Vui lòng liên hệ admin.');
  });

  // Demo accounts notification
  setTimeout(() => {
    toast.info('Demo: Sử dụng user@example.com / password để đăng nhập', 6000);
  }, 2000);
});
