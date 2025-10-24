-- Cập nhật role thành 'admin' cho user admin@example.com
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@example.com';

-- Kiểm tra kết quả
SELECT id, name, email, role FROM users WHERE email = 'admin@example.com';
