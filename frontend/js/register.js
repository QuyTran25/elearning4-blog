
    const registerForm = document.getElementById("registerForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirmPassword");
    const strengthBar = document.getElementById("strengthBar");
    const strengthText = document.getElementById("strengthText");

    // === 1️⃣ Ẩn/hiện mật khẩu ===
    document.querySelectorAll(".toggle-password").forEach(btn => {
      btn.addEventListener("click", () => {
        const input = btn.previousElementSibling;
        const isHidden = input.type === "password";
        input.type = isHidden ? "text" : "password";
        btn.classList.toggle("fa-eye");
        btn.classList.toggle("fa-eye-slash");
      });
    });

    // === 2️⃣ Tính độ mạnh của mật khẩu ===
    passwordInput.addEventListener("input", () => {
      const val = passwordInput.value;
      let strength = 0;

      if (val.length >= 6) strength++;
      if (/[A-Z]/.test(val)) strength++;
      if (/[0-9]/.test(val)) strength++;
      if (/[^A-Za-z0-9]/.test(val)) strength++;

      let width = (strength / 4) * 100;
      strengthBar.style.width = width + "%";

      if (strength <= 1) {
        strengthBar.style.background = "#e74c3c";
        strengthText.textContent = "Yếu";
        strengthText.style.color = "#e74c3c";
      } else if (strength === 2) {
        strengthBar.style.background = "#f1c40f";
        strengthText.textContent = "Trung bình";
        strengthText.style.color = "#f1c40f";
      } else {
        strengthBar.style.background = "#2ecc71";
        strengthText.textContent = "Mạnh";
        strengthText.style.color = "#2ecc71";
      }
    });

    // === 3️⃣ Khi nhấn Đăng ký ===
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      const confirm = confirmInput.value.trim();

      if (password !== confirm) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
      }

      // Lấy danh sách người dùng
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      // Kiểm tra email đã tồn tại
      const exists = users.find(u => u.email === email);
      if (exists) {
        alert("Email này đã được đăng ký!");
        return;
      }

      // Thêm người dùng mới
      users.push({ email, password });
      localStorage.setItem("users", JSON.stringify(users));

      alert("Đăng ký thành công! Hãy đăng nhập để tiếp tục.");
      window.location.href = "login.html";
    });
  