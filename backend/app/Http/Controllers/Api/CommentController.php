<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Blog;

class CommentController extends Controller
{
    /**
     * Lấy danh sách bình luận của một bài viết
     * GET /api/blogs/{blogId}/comments
     */
    public function index($blogId)
    {
        $blog = Blog::find($blogId);

        if (!$blog) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy bài viết'
            ], 404);
        }

        $comments = Comment::where('blog_id', $blogId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $comments
        ]);
    }

    /**
     * Tạo bình luận mới cho một bài viết
     * POST /api/blogs/{blogId}/comments
     * Public (không cần đăng nhập)
     */
    public function store(Request $request, $blogId)
    {
        $blog = Blog::find($blogId);

        if (!$blog) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy bài viết'
            ], 404);
        }

        // Validate dữ liệu
        $request->validate([
            'author_name' => 'nullable|string|max:100',
            'content' => 'required|string|min:1|max:2000',
        ], [
            'content.required' => 'Nội dung bình luận không được để trống',
            'content.max' => 'Bình luận không được vượt quá 2000 ký tự',
        ]);

        $comment = Comment::create([
            'blog_id' => $blogId,
            'author_name' => $request->input('author_name', 'Khách'),
            'content' => $request->input('content'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Bình luận đã được thêm',
            'data' => $comment
        ], 201);
    }
}
