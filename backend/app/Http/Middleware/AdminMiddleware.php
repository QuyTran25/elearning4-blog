<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // Kiểm tra user đã đăng nhập và có role admin
        if (!$request->user() || $request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Chỉ admin mới có quyền truy cập chức năng này'
            ], 403);
        }

        return $next($request);
    }
}
