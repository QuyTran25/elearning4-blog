<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreBlogRequest;
use App\Http\Requests\UpdateBlogRequest;
use App\Http\Requests\UploadImageRequest;
use App\Models\Blog;
use Illuminate\Support\Facades\Storage;

class BlogController extends Controller
{
    // 🟢 1. Lấy danh sách blog (có tìm kiếm + sắp xếp)
    public function index(Request $request)
    {
        // Validate search và sort parameters
        $request->validate([
            'search' => 'nullable|string|max:255',
            'sort' => 'nullable|in:asc,desc',
        ]);

        $query = Blog::with(['author', 'category']);

        // Tìm kiếm theo tiêu đề
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Sắp xếp (mặc định: mới nhất)
        $sort = $request->get('sort', 'desc');
        $query->orderBy('created_at', $sort);

        $blogs = $query->get();

        return response()->json([
            'success' => true,
            'data' => $blogs
        ]);
    }

    // 🟢 2. Xem chi tiết blog
    public function show($id)
    {
        $blog = Blog::with(['author', 'category'])->find($id);

        if (!$blog) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy bài viết'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $blog
        ]);
    }

    // 🟢 3. Tạo blog mới
    public function store(StoreBlogRequest $request)
    {
        // Validation tự động từ StoreBlogRequest

        // Tự động lấy author_id từ user đã đăng nhập
        $blog = Blog::create([
            'title' => $request->input('title'),
            'content' => $request->input('content'),
            'category_id' => $request->input('category_id'),
            'image_url' => $request->input('image_url'),
            'author_id' => auth()->id(), // Lấy từ user đã đăng nhập
        ]);

        // Load thông tin author để trả về
        $blog->load('author');

        return response()->json([
            'success' => true,
            'message' => 'Tạo blog thành công',
            'data' => $blog
        ], 201);
    }

    // 🟢 4. Cập nhật blog
    public function update(UpdateBlogRequest $request, $id)
    {
        // Validation tự động từ UpdateBlogRequest
        
        $blog = Blog::find($id);

        if (!$blog) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy bài viết'
            ], 404);
        }

        // Kiểm tra quyền: chỉ cho phép tác giả cập nhật blog của chính họ
        if ($blog->author_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền cập nhật bài viết này'
            ], 403);
        }

        // Cập nhật thông tin - Dùng update() thay vì gán trực tiếp
        $blog->update([
            'title' => $request->input('title'),
            'content' => $request->input('content'),
            'category_id' => $request->input('category_id'),
            'image_url' => $request->input('image_url'),
        ]);

        // Load lại thông tin author
        $blog->load('author');

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật blog thành công',
            'data' => $blog
        ], 200);
    }

    // 🟢 5. Xóa blog
    public function destroy($id)
    {
        $blog = Blog::find($id);

        if (!$blog) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy bài viết'
            ], 404);
        }

        // Kiểm tra quyền: chỉ cho phép tác giả xóa blog của chính họ
        if ($blog->author_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền xóa bài viết này'
            ], 403); // 403 Forbidden
        }

        // Xóa ảnh nếu có (không bắt buộc vì dùng URL)
        if ($blog->image_url && strpos($blog->image_url, '/storage/') === 0) {
            $oldImage = str_replace('/storage/', '', $blog->image_url);
            Storage::disk('public')->delete($oldImage);
        }

        $blog->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa blog thành công'
        ], 200);
    }

    // 🟢 6. Upload ảnh blog
    public function upload(UploadImageRequest $request)
    {
        // Validation tự động từ UploadImageRequest

        if ($request->hasFile('image')) {
            // Lưu vào storage/app/public/blogs
            $path = $request->file('image')->store('blogs', 'public');
            
            // Trả về URL để frontend sử dụng
            $url = '/storage/' . $path;
            
            return response()->json([
                'success' => true,
                'message' => 'Upload ảnh thành công',
                'data' => [
                    'url' => $url,
                    'path' => $path
                ]
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Không có file ảnh'
        ], 400);
    }
}
