#  E4-Blog - Nền tảng Blog Chia Sẻ Kiến Thức Công Nghệ

<div align="center">

**Một ứng dụng blog fullstack hiện đại với React + Laravel**

</div>

---

##  Tổng Quan

**E4-Blog** là nền tảng blog mini được xây dựng theo kiến trúc **API-first**, với backend và frontend hoàn toàn tách biệt:

- **Backend**: Laravel (PHP) cung cấp RESTful API + MySQL
- **Frontend**: React 19 (Vite) với giao diện hiện đại, responsive

Hệ thống có **2 vai trò**:
- ** Khách (Guest)**: Xem trang chủ, xem chi tiết bài viết, đọc/viết bình luận
- ** Admin**: Quản lý bài viết (CRUD), upload ảnh, xem lịch sử bình luận tiêu cực, xem dashboard

---

##  Công Nghệ Sử Dụng

### Backend
| Công nghệ | Phiên bản | Vai trò |
|-----------|-----------|---------|
| **PHP** | 8.3 | Ngôn ngữ server |
| **Laravel** | 10.x | Framework PHP |
| **Laravel Sanctum** | Latest | Xác thực API (token-based) |
| **MySQL** | 8.0 | Cơ sở dữ liệu |
| **Docker** | Latest | Container hóa |

### Frontend
| Công nghệ | Phiên bản | Vai trò |
|-----------|-----------|---------|
| **React** | 19.x | UI Framework |
| **Vite** | 5.x | Build tool |
| **React Router** | 7.x | Điều hướng |
| **Axios** | 1.x | HTTP client |
| **TailwindCSS** | 3.x | Styling |
| **Font: Inter + Lora** | Google Fonts | Typography |

---

##  Cấu Trúc Thư Mục

```plaintext
elearning4-blog/
│
├── backend/                          # Laravel API Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   │   ├── AuthController.php       # Đăng nhập/đăng xuất
│   │   │   │   ├── BlogController.php       # CRUD bài viết + upload ảnh
│   │   │   │   ├── CategoryController.php   # Danh mục
│   │   │   │   └── CommentController.php    # Bình luận
│   │   │   └── Requests/
│   │   │       ├── LoginRequest.php
│   │   │       ├── StoreBlogRequest.php
│   │   │       ├── UpdateBlogRequest.php
│   │   │       └── UploadImageRequest.php
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Blog.php
│   │       ├── Category.php
│   │       └── Comment.php
│   ├── config/
│   │   ├── cors.php                  # CORS config
│   │   └── sanctum.php              # Sanctum config
│   ├── database/migrations/         # Schema migrations
│   ├── routes/api.php               # API routes
│   ├── storage/app/public/blogs/    # Ảnh upload
│   ├── .env                         # Biến môi trường
│   └── Dockerfile                   # Docker image
│
├── frontend-v2/                     # React Frontend
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/                # Login/logout
│   │   │   ├── blogs/               # Trang chủ, chi tiết bài viết
│   │   │   ├── dashboard/           # Admin: sidebar, create/edit post
│   │   │   └── moderation/          # Admin: lịch sử bình luận
│   │   ├── layouts/                 # Layout components
│   │   └── shared/services/         # API services, axios config
│   ├── vite.config.js               # Vite config (có proxy)
│   └── package.json
│
├── docker-compose.yml               # Docker compose (MySQL + Laravel)
├── reset-database.sql               # SQL script khởi tạo database
└── README.md                        # Bạn đang đọc file này
```

---

##  Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu Cầu Hệ Thống

- **Docker Desktop** đã cài đặt và đang chạy
- **Node.js 18+** (để chạy frontend React)
- **Git** (clone source code)
- **Trình duyệt** Chrome / Edge / Firefox

---

### Bước 1: Clone Dự Án

```bash
git clone https://github.com/QuyTran25/elearning4-blog.git
cd elearning4-blog
```

---

### Bước 2: Khởi Động Backend (Docker)

```bash
# Khởi động MySQL + Laravel
docker-compose up -d
```

Docker sẽ tự động:
1. Khởi tạo **MySQL 8.0** (port `3307`)
2. Import database từ `reset-database.sql` (gồm: users, categories, blogs mẫu)
3. Cài đặt PHP dependencies (`composer install`)
4. Tạo storage symbolic link
5. Khởi động **Laravel API** (port `8000`)

**Kiểm tra trạng thái:**

```bash
docker-compose ps
```

Cả 2 container phải có trạng thái `Up`.\
Backend chạy tại: **http://localhost:8000**

**Xem log nếu cần debug:**

```bash
docker-compose logs -f laravel
```

---

### Bước 3: Cài Đặt & Chạy Frontend

```bash
# Di chuyển vào thư mục frontend
cd frontend-v2

# Cài đặt dependencies
npm install

# Khởi động dev server
npm run dev
```

Frontend chạy tại: **http://localhost:5173** 🎉

> **Lưu ý:** Frontend sử dụng Vite proxy để gọi API backend:
> - `/api/*` → `http://127.0.0.1:8000/api/*`
> - `/storage/*` → `http://127.0.0.1:8000/storage/*`
>
> Không cần cấu hình CORS hay URL tuyệt đối — mọi thứ đã được thiết lập sẵn!

---

##  Tài Khoản Mặc Định

| Email | Mật khẩu | Vai trò |
|-------|----------|---------|
| `admin@example.com` | `admin123` |  Admin |

> Admin có toàn quyền: tạo/sửa/xóa bài viết, upload ảnh, xem dashboard và moderation logs.

---

##  Hướng Dẫn Sử Dụng

###  Trang Chủ (Guest + Admin)

Mở **http://localhost:5173** để xem trang chủ với:
- Danh sách bài viết dạng **grid** và **list**
- Tìm kiếm theo tiêu đề
- Phân loại theo danh mục
- Ảnh đại diện cho mỗi bài viết

> **Khi đã đăng nhập với admin**: mỗi bài viết sẽ hiển thị icon  (sửa) và  (xóa).

###  Đăng Nhập Admin

1. Click **"Đăng nhập"** ở header
2. Nhập: `admin@example.com` / `admin123`
3. Sau khi đăng nhập, bạn sẽ thấy menu **Dashboard** ở header

###  Quản Lý Bài Viết (Admin)

Sau khi đăng nhập, click **Dashboard** hoặc truy cập **http://localhost:5173/admin/dashboard**:

- ** Tạo bài viết mới**: Click "Tạo bài viết mới"
  - Nhập tiêu đề, chọn danh mục
  - Upload ảnh đại diện (click vào vùng upload)
  - Viết nội dung
  - Click "Xuất bản"
- ** Sửa bài viết**: Click icon  trên bài viết ở trang chủ hoặc trang chi tiết
- ** Xóa bài viết**: Click icon  (xác nhận xóa)

###  Bình Luận (Guest + Admin)

Ở trang chi tiết bài viết, mọi người (không cần đăng nhập) có thể:
- Xem danh sách bình luận
- Viết bình luận mới

###  Moderation Logs (Admin)

Truy cập **Dashboard → Moderation Logs** để xem lịch sử các bình luận tiêu cực.

---

##  Các Tính Năng Chính

###  Đã Hoàn Thiện

| Tính năng | Mô tả |
|-----------|-------|
|  **Trang chủ** | Danh sách bài viết dạng grid/list, tìm kiếm, filter danh mục |
|  **Chi tiết bài viết** | Xem nội dung đầy đủ, thông tin tác giả, danh mục, ảnh |
|  **Đăng nhập Admin** | Xác thực token qua Laravel Sanctum |
|  **CRUD bài viết** | Tạo/sửa/xóa bài viết (admin only) |
|  **Upload ảnh** | Upload ảnh đại diện cho bài viết |
|  **Bình luận** | Xem và viết bình luận (public) |
|  **Dashboard** | Giao diện quản lý admin |
|  **Tìm kiếm** | Tìm kiếm bài viết theo tiêu đề |
|  **Danh mục** | 7 danh mục công nghệ khác nhau |
|  **Responsive** | Giao diện tương thích mọi thiết bị |

###  Chưa Hoàn Thiện

- **Moderation Logs**: API backend chưa kết nối (đang dùng mock data)
- **Xóa bài viết**: Hiện tại dùng `window.confirm()` — sẽ nâng cấp lên modal

---

##  API Endpoints

### Authentication
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/auth/login` | Đăng nhập | ❌ |
| POST | `/api/login` | Đăng nhập (alias) | ❌ |
| POST | `/api/logout` | Đăng xuất | ✅ |
| GET | `/api/user` | Thông tin user hiện tại | ✅ |

### Blog Management
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/blogs` | Danh sách bài viết (`?search=&sort=`) | ❌ |
| GET | `/api/blogs/{id}` | Chi tiết bài viết | ❌ |
| POST | `/api/blogs` | Tạo bài viết mới | ✅ |
| PUT | `/api/blogs/{id}` | Cập nhật bài viết | ✅ |
| DELETE | `/api/blogs/{id}` | Xóa bài viết | ✅ |
| POST | `/api/blogs/upload-image` | Upload ảnh | ✅ |

### Categories
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/categories` | Danh sách danh mục | ❌ |

### Comments
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/blogs/{blogId}/comments` | Danh sách bình luận | ❌ |
| POST | `/api/blogs/{blogId}/comments` | Thêm bình luận | ❌ |

---

##  Khắc Phục Sự Cố

### Lỗi: `Connection refused` / Không kết nối được backend

```bash
# Kiểm tra Docker containers
docker-compose ps

# Nếu MySQL hoặc Laravel chưa chạy, khởi động lại
docker-compose down
docker-compose up -d
```

### Lỗi: 401 Unauthorized khi gọi API

Token hết hạn hoặc chưa đăng nhập. Hãy đăng nhập lại:
```bash
# Có thể dùng curl để test
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Lỗi: Upload ảnh thất bại (422)

Kiểm tra storage link trong container Laravel:
```bash
docker-compose exec laravel php artisan storage:link
```

### Lỗi: Ảnh không hiển thị

Frontend sử dụng Vite proxy để load ảnh từ `/storage/*`. Kiểm tra:
- Backend đang chạy ở `http://localhost:8000`
- File ảnh tồn tại trong `backend/storage/app/public/blogs/`

### Lỗi: Port 5173 đã được sử dụng

```bash
# Kiểm tra process nào đang dùng port 5173
netstat -ano | findstr :5173

# Kill process đó (thay PID bằng số ở cột cuối)
taskkill /F /PID <PID>
# Sau đó chạy lại npm run dev
```

### Lỗi: Database bị lỗi encoding (tiếng Việt hiện sai)

Import lại database với đúng charset:
```bash
docker-compose down -v    # Xóa volume database
docker-compose up -d      # Tạo lại từ reset-database.sql
```

### Lỗi: `npm install` thất bại

```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Reset toàn bộ dự án

```bash
# Dừng và xóa database
docker-compose down -v

# Khởi động lại
docker-compose up -d

# Chạy frontend
cd frontend-v2
npm run dev
```

---

## 📸 Demo

| Trang | Mô tả |
|-------|-------|
|  Trang chủ | Danh sách bài viết với ảnh, danh mục, tìm kiếm |
|  Chi tiết bài viết | Nội dung đầy đủ + bình luận |
|  Đăng nhập | Form đăng nhập admin |
|  Tạo bài viết | Form tạo bài viết với upload ảnh |
|  Sửa bài viết | Chỉnh sửa nội dung bài viết hiện có |
|  Dashboard | Quản lý bài viết, thống kê |

---

##  Thành Viên Nhóm

<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/QuyTran25">
          <img src="https://github.com/QuyTran25.png" width="100px;" alt="QuyTran25"/>
          <br /><sub><b>Huỳnh Thị Quý Trân</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/akhoa79">
          <img src="https://github.com/akhoa79.png" width="100px;" alt="akhoa79"/>
          <br /><sub><b>Nguyễn Đỗ Anh Khoa</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/Shinnie102">
          <img src="https://github.com/Shinnie102.png" width="100px;" alt="Shinnie102"/>
          <br /><sub><b>Nguyễn Thị Thùy Trang</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/khain7728">
          <img src="https://github.com/khain7728.png" width="100px;" alt="khain7728"/>
          <br /><sub><b>Nguyễn Quốc Khải</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/LeVietSangg">
          <img src="https://github.com/LeVietSangg.png" width="100px;" alt="LeVietSangg"/>
          <br /><sub><b>Lê Viết Sang</b></sub>
        </a>
      </td>
    </tr>
  </table>
</div>

---


