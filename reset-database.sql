-- XÓA VÀ TẠO LẠI DATABASE ĐƠN GIẢN
DROP DATABASE IF EXISTS `e4-blog`;
CREATE DATABASE `e4-blog` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `e4-blog`;

-- Bảng users với role
CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng personal_access_tokens cho Laravel Sanctum
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL UNIQUE,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tokenable` (`tokenable_type`, `tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng categories (giữ nguyên từ schema cũ)
CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng blogs (giữ nguyên từ schema cũ)
CREATE TABLE `blogs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `author_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `author_id` (`author_id`),
  FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- INSERT ADMIN ACCOUNT
-- Email: admin@example.com
-- Password: admin123
INSERT INTO `users` (`name`, `email`, `password`, `role`) 
VALUES ('Administrator', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- INSERT CATEGORIES MẪU
INSERT INTO `categories` (`name`) VALUES
('Lập trình Web'),
('Công nghệ phần mềm'),
('Trí tuệ nhân tạo (AI)'),
('Phát triển ứng dụng di động'),
('Bảo mật & An toàn thông tin'),
('Kinh nghiệm lập trình viên'),
('Học tập & Phát triển bản thân');

-- INSERT BLOGS MẪU
INSERT INTO `blogs` (`category_id`, `title`, `content`, `image_url`, `author_id`) VALUES
(1, 'Những nguyên tắc vàng trong lập trình web hiện đại', 'Bài viết chia sẻ những nguyên tắc quan trọng giúp lập trình viên phát triển website hiệu quả, bảo trì dễ dàng và mở rộng linh hoạt.', 'images/học fullstacsk.jpg', 1),
(2, 'Cách tối ưu hiệu suất phần mềm trong dự án lớn', 'Tìm hiểu về kỹ thuật refactor code, profiling và caching giúp hệ thống chạy nhanh và ổn định hơn.', 'images/mã code.jpg', 1),
(3, 'AI và tương lai ngành lập trình', 'Trí tuệ nhân tạo đang thay đổi cách chúng ta viết code, học lập trình và phát triển phần mềm trong thời đại mới.', 'images/AI.jpg', 1);
