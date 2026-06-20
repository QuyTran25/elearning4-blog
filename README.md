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

##  Hướng Dẫn Cài Đặt & Chạy Dự Án (Fullstack + AI)

### Yêu Cầu Hệ Thống & Cấu Trúc Thư Mục
Hệ thống sử dụng Docker Compose để chạy cả **Laravel (Backend)**, **MySQL (Database)**, và **AI Service (Python FastAPI)**.
Để hệ thống hoạt động, **bắt buộc** phải clone 2 kho lưu trữ (`elearning4-blog` và `AI_Toxic_Comment_Detection`) nằm ngang hàng nhau trong cùng một thư mục cha.

```plaintext
D:/ (hoặc thư mục bất kỳ)
├── AI_Toxic_Comment_Detection/    # Dự án AI Model
└── elearning4-blog/               # Dự án Blog (Bạn đang ở đây)
```

- **Docker Desktop** đã cài đặt và đang chạy
- **Node.js 18+** (để chạy frontend React)
- **Git** (để clone source code)

---

### Bước 1: Clone 2 kho lưu trữ

Mở terminal tại thư mục cha và chạy:

```bash
# Clone dự án AI (nếu chưa có)
git clone https://github.com/akhoa79/AI_Toxic_Comment_Detection.git

# Clone dự án Blog
git clone https://github.com/QuyTran25/elearning4-blog.git

# Di chuyển vào thư mục dự án Blog
cd elearning4-blog
```

---

### Bước 2: Khởi Động Hệ Thống Backend Bằng Docker

```bash
# Xây dựng và khởi động MySQL, Laravel, và AI Service
docker-compose up -d --build
```

Docker sẽ tự động:
1. Khởi động **MySQL 8.0** (port `3307`)
2. Khởi động **Laravel API** (port `8000`)
3. Khởi động **AI Service** (port `5000`)

Kiểm tra trạng thái các container:
```bash
docker-compose ps
```
*(Đảm bảo cả 3 container `e4blog-mysql`, `e4blog-laravel`, và `e4blog-ai` đều ở trạng thái `Up`)*

---

### Bước 3: Khởi Tạo Cấu Trúc Database (Bắt buộc)

Mặc dù MySQL có import `reset-database.sql`, tập lệnh đó **chưa có** các bảng kiểm duyệt bình luận mới của AI. Bạn **phải** chạy lệnh sau để Laravel tạo lại toàn bộ bảng và seed dữ liệu mẫu:

```bash
docker-compose exec laravel php artisan migrate:fresh --seed
```

*(Lệnh này sẽ xóa DB cũ, chạy toàn bộ migrations để tạo bảng `users`, `blogs`, `comments`, `moderation_logs`..., và tự động tạo tài khoản Admin).*

---

### Bước 4: Cài Đặt & Chạy Frontend

```bash
# Chuyển vào thư mục frontend
cd frontend-v2

# Cài đặt thư viện
npm install

# Khởi động React Dev Server
npm run dev
```

Frontend chạy tại: **http://localhost:5173** 🎉

> **Lưu ý Networking:** Frontend tự động proxy các đường dẫn:
> - `/api/*` → Laravel API (`http://127.0.0.1:8000/api/*`)
> - Backend Laravel sẽ gọi nội bộ qua AI Service tại `http://ai-service:5000/api/analyze`

---

##  Tài Khoản Mặc Định

| Email | Mật khẩu | Vai trò |
|-------|----------|---------|
| `admin@example.com` | `admin123` |  Admin |

> Admin có toàn quyền: tạo/sửa/xóa bài viết, upload ảnh, xem Moderation Logs, xóa và quản lý bình luận trên blog.

---

##  Hướng Dẫn Sử Dụng

###  Trang Chủ (Guest + Admin)
Mở **http://localhost:5173** để xem trang chủ với:
- Danh sách bài viết dạng grid và list
- Tìm kiếm theo tiêu đề và phân loại danh mục

###  Quản Lý & Kiểm Duyệt Bình Luận (Admin)
1. **Đăng nhập**: Dùng tài khoản admin.
2. **Comment Logs**: Truy cập **Dashboard → Moderation Logs** để xem toàn bộ bình luận.
3. Nhấp **"Xem Chi Tiết"** để xem thông tin chẩn đoán từ AI (nhãn `Clean`, `Toxic`, `Insult`, độ tin cậy, và các từ khóa vi phạm).
4. Nhấp **"Đi đến bình luận"** để hệ thống cuộn thẳng đến vị trí bình luận đó trên giao diện bài viết.
5. Admin có thể **"Xóa"** bình luận trực tiếp trong bảng Logs hoặc ngay trên giao diện đọc bài viết.

---

##  Các Tính Năng Chính

###  Đã Hoàn Thiện

| Tính năng | Mô tả |
|-----------|-------|
|  **Trang chủ** | Danh sách bài viết dạng grid/list, tìm kiếm, filter danh mục |
|  **Chi tiết bài viết** | Xem nội dung đầy đủ, thông tin tác giả, danh mục, ảnh |
|  **Đăng nhập Admin** | Xác thực token qua Laravel Sanctum |
|  **CRUD bài viết** | Tạo/sửa/xóa bài viết (admin only) |
|  **Bình luận AI** | Viết bình luận. AI kiểm duyệt tự động (chặn từ tục/bắt tự sửa) |
|  **Moderation Logs**| Dashboard quản trị kiểm duyệt bình luận, cuộn nhanh, và xóa |
|  **Dashboard** | Giao diện quản lý admin |
|  **Responsive** | Giao diện tương thích mọi thiết bị |

###  Đang Cải Thiện
- **Xóa bài viết**: Hiện tại dùng `window.confirm()` — dự kiến sẽ nâng cấp lên custom modal.

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


