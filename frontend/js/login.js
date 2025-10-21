// Xử lý form đăng nhập admin
document.addEventListener('DOMContentLoaded', function() {
    
    // Kiểm tra nếu đã đăng nhập thì redirect về trang chủ
    if (isAdmin()) {
        window.location.href = 'index.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = this.querySelector('button[type=\"submit\"]');
        const originalText = submitBtn.textContent;
        
        // Hiển thị loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang đăng nhập...';
        
        try {
            // Gọi API đăng nhập admin từ auth_api.js
            const result = await loginAdmin(email, password);
            
            if (result.success) {
                // Hiển thị thông báo thành công
                alert('Đăng nhập thành công! Chào mừng Admin.');
                
                // Chuyển đến trang chủ
                window.location.href = 'index.html';
            } else {
                // Hiển thị lỗi từ API
                alert(result.message || 'Đăng nhập thất bại!');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Có lỗi xảy ra: ' + error.message);
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});
