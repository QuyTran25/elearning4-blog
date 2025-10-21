<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Đăng nhập - CHỈ DÀNH CHO ADMIN
     */
    public function login(Request $request)
    {
        // Validate input
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Tìm user theo email
        $user = User::where('email', $request->email)->first();

        // Kiểm tra user tồn tại và mật khẩu đúng
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email hoặc mật khẩu không đúng'
            ], 401);
        }

        // Kiểm tra PHẢI là admin
        if ($user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Chỉ admin mới được đăng nhập vào hệ thống'
            ], 403);
        }

        // Tạo token
        $token = $user->createToken('auth_token')->plainTextToken;
        
        // Trả về thông tin đầy đủ
        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role
            ],
            'token' => $token
        ]);
    }

    /**
     * Đăng xuất
     */
    public function logout(Request $request)
    {
        // Xóa tất cả tokens của user
        $request->user()->tokens()->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Đăng xuất thành công'
        ]);
    }

    /**
     * Lấy thông tin user hiện tại
     */
    public function user(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    }
}
