
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const rememberCheckbox = document.getElementById("remember");

    // === 1️⃣ Khi load trang: Tự động điền email & password nếu đã lưu ===
    window.addEventListener("DOMContentLoaded", () => {
      const savedEmail = localStorage.getItem("rememberedEmail");
      const savedPassword = localStorage.getItem("rememberedPassword");

      if (savedEmail && savedPassword) {
        emailInput.value = savedEmail;
        passwordInput.value = savedPassword;
        rememberCheckbox.checked = true;
      }
    });

    // === 2️⃣ Khi nhấn Đăng nhập ===
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      // Giả lập tài khoản hợp lệ
      const validEmail = "admin@gmail.com";
      const validPassword = "123456";

      if (email === validEmail && password === validPassword) {
        localStorage.setItem("loggedIn", "true");

        // Nếu tick "Ghi nhớ đăng nhập"
        if (rememberCheckbox.checked) {
          localStorage.setItem("rememberedEmail", email);
          localStorage.setItem("rememberedPassword", password);
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
        }

        window.location.href = "index.html";
      } else {
        alert("Email hoặc mật khẩu không đúng. Vui lòng thử lại!");
      }
    });

    // === 3️⃣ Ẩn/hiện mật khẩu ===
    const togglePassword = document.getElementById("togglePassword");
    togglePassword.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
      togglePassword.classList.toggle("fa-eye");
      togglePassword.classList.toggle("fa-eye-slash");
    });

    // === 4️⃣ Hiển thị thông báo cho nút mạng xã hội ===
    document.querySelectorAll(".social-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        alert("Chức năng đăng nhập bằng " + btn.textContent.trim() + " sẽ được cập nhật sau!");
      });
    });
