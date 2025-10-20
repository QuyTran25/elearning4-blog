import { registerUser } from "./auth_api.js";

document.addEventListener("DOMContentLoaded", () => {
  // Redirect nếu đã login
  if (getCurrentUser()) {
    window.location.href = "index.html";
    return;
  }

  const registerForm = document.getElementById("registerForm");
  const errorMessage = document.getElementById("errorMessage");
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const agreeTermsCheckbox = document.getElementById("agreeTerms");
  const passwordStrength = document.getElementById("passwordStrength");

  // Password strength checker
  function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = [];

    if (password.length >= 6) strength += 1;
    else feedback.push("ít nhất 6 ký tự");

    if (/[a-z]/.test(password)) strength += 1;
    else feedback.push("chữ thường");

    if (/[A-Z]/.test(password)) strength += 1;
    else feedback.push("chữ hoa");

    if (/[0-9]/.test(password)) strength += 1;
    else feedback.push("số");

    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    else feedback.push("ký tự đặc biệt");

    return { strength, feedback };
  }

  function updatePasswordStrength(password) {
    if (!password) {
      passwordStrength.innerHTML = '';
      return;
    }

    const { strength, feedback } = checkPasswordStrength(password);
    let strengthText = '';
    let strengthClass = '';

    if (strength < 2) {
      strengthText = '🔴 Yếu';
      strengthClass = 'weak';
    } else if (strength < 4) {
      strengthText = '🟡 Trung bình';
      strengthClass = 'medium';
    } else {
      strengthText = '🟢 Mạnh';
      strengthClass = 'strong';
    }

    const missingText = feedback.length > 0 ?
      `<br><small>Cần: ${feedback.join(', ')}</small>` : '';

    passwordStrength.innerHTML = `
      <div class="password-strength ${strengthClass}">
        ${strengthText}${missingText}
        <div class="strength-bar">
          <div class="strength-fill ${strengthClass}"></div>
        </div>
      </div>
    `;
  }

  // Clear errors khi nhập
  [fullNameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
    input?.addEventListener('input', () => {
      FormValidator.clearFieldError(input.id);
      errorMessage.textContent = '';

      if (input === passwordInput) {
        updatePasswordStrength(input.value);
      }
    });
  });

  // Handle form submit
  registerForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear errors
    FormValidator.clearAllErrors();
    errorMessage.textContent = '';

    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const agreeTerms = agreeTermsCheckbox?.checked;

    // Validation
    let hasError = false;
    if (!fullName) { FormValidator.showFieldError('fullName', 'Vui lòng nhập họ và tên'); hasError = true; }
    else if (fullName.length < 2) { FormValidator.showFieldError('fullName', 'Họ và tên phải có ít nhất 2 ký tự'); hasError = true; }

    if (!email) { FormValidator.showFieldError('email', 'Vui lòng nhập email'); hasError = true; }
    else if (!FormValidator.isValidEmail(email)) { FormValidator.showFieldError('email', 'Định dạng email không hợp lệ'); hasError = true; }

    if (!password) { FormValidator.showFieldError('password', 'Vui lòng nhập mật khẩu'); hasError = true; }
    else if (password.length < 6) { FormValidator.showFieldError('password', 'Mật khẩu phải có ít nhất 6 ký tự'); hasError = true; }

    if (!confirmPassword) { FormValidator.showFieldError('confirmPassword', 'Vui lòng xác nhận mật khẩu'); hasError = true; }
    else if (password !== confirmPassword) { FormValidator.showFieldError('confirmPassword', 'Mật khẩu xác nhận không khớp'); hasError = true; }

    if (!agreeTerms) { toast.error('Vui lòng đồng ý với điều khoản sử dụng'); hasError = true; }

    if (hasError) return;

    // Loading
    setButtonLoading('registerForm', true);

    try {
      const result = await registerUser(fullName, email, password);

      if (result.success && result.user && result.token) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.token);

        toast.success(`Chào mừng ${result.user.name}! Đăng ký thành công.`);

        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      } else {
        errorMessage.textContent = result.message || "Đăng ký thất bại.";
        toast.error(result.message || "Đăng ký thất bại.");
      }

    } catch (error) {
      console.error("Registration error:", error);
      errorMessage.textContent = error.message || "Có lỗi xảy ra. Vui lòng thử lại.";
      toast.error(error.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setButtonLoading('registerForm', false);
    }
  });
});
