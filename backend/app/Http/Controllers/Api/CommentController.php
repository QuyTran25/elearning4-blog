<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Blog;
use App\Models\ModerationUser;
use App\Models\ModerationLog;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CommentController extends Controller
{
    private $aiServiceUrl = 'http://ai-service:5000/api';

    /**
     * Lấy danh sách bình luận công khai của một bài viết
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
            ->whereNull('parent_id')
            ->whereIn('status', ['posted', 'posted_censored', 'posted_smart'])
            ->orderBy('created_at', 'desc')
            ->with(['replies' => function ($q) {
                $q->orderBy('created_at', 'asc');
            }])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $comments
        ]);
    }

    /**
     * Tạo bình luận mới cho một bài viết (qua AI Classify)
     * POST /api/blogs/{blogId}/comments
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

        $authorName = $request->input('author_name', 'Khách');
        $content = $request->input('content');

        // Khởi tạo các giá trị mặc định phòng khi AI lỗi
        $action = 'ALLOW';
        $status = 'posted';
        $displayedText = $content;
        $mlpLabel = 'Clean';
        $mlpConfidence = 1.0;
        $badWords = [];
        $message = 'Bình luận hợp lệ. Đã đăng thành công.';

        try {
            // Gọi AI classify
            $response = Http::timeout(5)->post("{$this->aiServiceUrl}/analyze", [
                'text' => $content
            ]);

            if ($response->successful()) {
                $aiResult = $response->json();
                $action = $aiResult['action'] ?? 'ALLOW';
                $mlpLabel = $aiResult['mlp_label'] ?? 'Clean';
                $mlpConfidence = $aiResult['mlp_confidence'] ?? 1.0;
                $badWords = $aiResult['bad_words'] ?? [];
                $message = $aiResult['message'] ?? $message;

                if ($action === 'ALLOW') {
                    $status = 'posted';
                    $displayedText = $content;
                } elseif ($action === 'SUGGEST_FLEXIBLE') {
                    $status = 'posted_censored';
                    $displayedText = $aiResult['censored_text'] ?? $content;
                } elseif ($action === 'SUGGEST_STRICT') {
                    $status = 'pending_edit';
                    $displayedText = null;
                }
            } else {
                Log::warning('AI Service returned error: ' . $response->body());
            }
        } catch (\Exception $e) {
            Log::error('Failed to connect to AI Service: ' . $e->getMessage());
        }

        $comment = Comment::create([
            'blog_id' => $blogId,
            'author_name' => $authorName,
            'content' => $content,
            'displayed_text' => $displayedText,
            'mlp_label' => $mlpLabel,
            'mlp_confidence' => $mlpConfidence,
            'bad_words' => $badWords,
            'action' => $action,
            'status' => $status,
        ]);

        return response()->json([
            'success' => true,
            'action' => $action,
            'status' => $status,
            'comment_id' => $comment->id,
            'original_text' => $content,
            'censored_text' => $action === 'SUGGEST_FLEXIBLE' ? ($aiResult['censored_text'] ?? null) : null,
            'smart_text' => in_array($action, ['SUGGEST_STRICT', 'SUGGEST_FLEXIBLE']) ? ($aiResult['smart_text'] ?? null) : null,
            'message' => $message,
            'data' => $comment
        ], $action === 'SUGGEST_STRICT' ? 200 : 201);
    }

    /**
     * Kiểm tra thô tục nhanh phục vụ gõ phím (Type-ahead)
     * POST /api/blogs/{blogId}/comments/classify
     */
    public function quickCheck(Request $request)
    {
        $request->validate([
            'text' => 'required|string',
        ]);

        try {
            $response = Http::timeout(3)->post("{$this->aiServiceUrl}/quick-check", [
                'text' => $request->input('text')
            ]);

            if ($response->successful()) {
                return response()->json($response->json());
            }
        } catch (\Exception $e) {
            Log::error('Quick check AI Service error: ' . $e->getMessage());
        }

        return response()->json([
            'has_profanity' => false,
            'bad_words' => [],
            'censored_text' => $request->input('text'),
            'smart_suggestion' => '',
            'replacement_map' => new \stdClass()
        ]);
    }

    /**
     * Xác nhận phản hồi Modal của user (Đăng/Sửa/Hủy)
     * POST /api/blogs/{blogId}/comments/confirm
     */
    public function confirmPost(Request $request, $blogId)
    {
        $request->validate([
            'comment_id' => 'required|integer|exists:comments,id',
            'username' => 'required|string',
            'user_choice' => 'required|string|in:y,n',
            'new_text' => 'nullable|string',
        ]);

        $commentId = $request->input('comment_id');
        $username = $request->input('username');
        $choice = strtolower($request->input('user_choice'));
        $newText = $request->input('new_text');

        $comment = Comment::find($commentId);

        if ($choice === 'y') {
            if (!$newText) {
                return response()->json([
                    'success' => false,
                    'message' => 'Thiếu nội dung mới khi đồng ý sửa'
                ], 400);
            }

            $comment->update([
                'displayed_text' => $newText,
                'status' => 'posted_smart'
            ]);

            ModerationLog::create([
                'comment_id' => $commentId,
                'username' => $username,
                'log_action' => 'USER_ACCEPTED_EDIT',
                'details' => "User accepted edit. New text: {$newText}"
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Bình luận đã được đăng thành công với nội dung mới.',
                'data' => $comment
            ]);
        } else {
            $comment->update([
                'status' => 'blocked',
                'displayed_text' => null
            ]);

            $modUser = ModerationUser::firstOrCreate(
                ['username' => $username],
                ['risk_level' => 'LOW', 'violation_count' => 0]
            );

            $violations = $modUser->violation_count + 1;

            if ($violations >= 5) {
                $newRisk = 'SEVERE';
            } elseif ($violations >= 3) {
                $newRisk = 'HIGH';
            } else {
                $newRisk = 'MEDIUM';
            }

            $modUser->update([
                'violation_count' => $violations,
                'risk_level' => $newRisk
            ]);

            ModerationLog::create([
                'comment_id' => $commentId,
                'username' => $username,
                'log_action' => 'USER_REFUSED_BLOCK',
                'details' => "User refused to edit. Violations: {$violations}, Risk: {$newRisk}"
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Bình luận đã bị chặn do vi phạm quy chuẩn cộng đồng.'
            ]);
        }
    }

    /**
     * Lấy danh sách lịch sử kiểm duyệt cho Admin
     * GET /api/moderation/logs
     */
    public function getModerationLogs()
    {
        $logs = Comment::with('blog')->orderBy('created_at', 'desc')
            ->take(1000)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $logs
        ]);
    }

    /**
     * Xóa bình luận (Admin)
     * DELETE /api/comments/{commentId}
     */
    public function destroy($commentId)
    {
        $comment = Comment::find($commentId);

        if (!$comment) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy bình luận'
            ], 404);
        }

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa bình luận thành công'
        ]);
    }

    /**
     * Lấy chi tiết 1 bình luận theo ID (bao gồm thông tin bài viết)
     * GET /api/comments/{commentId}/detail
     */
    public function getCommentDetail($commentId)
    {
        $comment = Comment::with('blog')->find($commentId);

        if (!$comment) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy bình luận'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $comment
        ]);
    }

    /**
     * Admin trả lời bình luận
     * POST /api/comments/{commentId}/reply
     */
    public function reply(Request $request, $commentId)
    {
        $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $parentComment = Comment::find($commentId);

        if (!$parentComment) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy bình luận'
            ], 404);
        }

        $user = auth()->user();

        $reply = Comment::create([
            'blog_id' => $parentComment->blog_id,
            'parent_id' => $commentId,
            'author_id' => $user?->id,
            'author_name' => $user?->name ?? 'Admin',
            'content' => $request->input('content'),
            'displayed_text' => $request->input('content'),
            'mlp_label' => 'Clean',
            'mlp_confidence' => 1.0,
            'bad_words' => [],
            'action' => 'ALLOW',
            'status' => 'posted',
            'is_admin_reply' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Trả lời thành công',
            'data' => $reply,
        ], 201);
    }

    /**
     * Lấy thống kê kiểm duyệt
     * GET /api/moderation/stats
     */
    public function getModerationStats()
    {
        try {
            $stats = [
                'total_comments' => Comment::count(),
                'by_status' => Comment::selectRaw('status, COUNT(*) as count')
                    ->groupBy('status')
                    ->pluck('count', 'status'),
                'by_label' => Comment::selectRaw('mlp_label, COUNT(*) as count')
                    ->groupBy('mlp_label')
                    ->pluck('count', 'mlp_label'),
            ];
            return response()->json(['success' => true, 'data' => $stats]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'data' => []]);
        }
    }
}
