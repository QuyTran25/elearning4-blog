<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('blogs')->insert([
            [
                'category_id' => 1,
                'title' => 'Những nguyên tắc vàng trong lập trình web hiện đại',
                'content' => 'Bài viết chia sẻ những nguyên tắc quan trọng giúp lập trình viên phát triển website hiệu quả, bảo trì dễ dàng và mở rộng linh hoạt.',
                'image_url' => 'images/học fullstacsk.jpg',
                'author_id' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'category_id' => 2,
                'title' => 'Cách tối ưu hiệu suất phần mềm trong dự án lớn',
                'content' => 'Tìm hiểu về kỹ thuật refactor code, profiling và caching giúp hệ thống chạy nhanh và ổn định hơn.',
                'image_url' => 'images/mã code.jpg',
                'author_id' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'category_id' => 3,
                'title' => 'AI và tương lai ngành lập trình',
                'content' => 'Trí tuệ nhân tạo đang thay đổi cách chúng ta viết code, học lập trình và phát triển phần mềm trong thời đại mới.',
                'image_url' => 'images/AI.jpg',
                'author_id' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
