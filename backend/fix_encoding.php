<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Http\Kernel');
$response = $kernel->handle(
    $request = \Illuminate\Http\Request::capture()
);

// Get DB connection
$db = \Illuminate\Support\Facades\DB::class;
\Illuminate\Support\Facades\DB::statement("SET NAMES utf8mb4");

// Update blogs with correct Vietnamese text
\Illuminate\Support\Facades\DB::table('blogs')->where('id', 1)->update([
    'title' => 'Những nguyên tắc vàng trong lập trình web hiện đại',
    'content' => 'Bài viết chia sẻ những nguyên tắc quan trọng giúp lập trình viên phát triển website hiệu quả, bảo trì dễ dàng và mở rộng linh hoạt.'
]);

\Illuminate\Support\Facades\DB::table('blogs')->where('id', 2)->update([
    'title' => 'Cách tối ưu hiệu suất phần mềm trong dự án lớn',
    'content' => 'Tìm hiểu về kỹ thuật refactor code, profiling và caching giúp hệ thống chạy nhanh và ổn định hơn.'
]);

\Illuminate\Support\Facades\DB::table('blogs')->where('id', 3)->update([
    'title' => 'AI và tương lai ngành lập trình',
    'content' => 'Trí tuệ nhân tạo đang thay đổi cách chúng ta viết code, học lập trình và phát triển phần mềm trong thời đại mới.'
]);

echo "✓ Cập nhật encoding thành công!\n";
