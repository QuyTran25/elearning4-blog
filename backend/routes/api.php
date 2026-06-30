<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

use App\Http\Controllers\Api\BlogController;

Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{id}', [BlogController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/blogs', [BlogController::class, 'store']);
    Route::put('/blogs/{id}', [BlogController::class, 'update']);
    Route::delete('/blogs/{id}', [BlogController::class, 'destroy']);
    Route::post('/blogs/upload-image', [BlogController::class, 'upload']);
});

Route::post('/blogs/{id}/like', [BlogController::class, 'toggleLike']);

// Categories (public)
use App\Http\Controllers\Api\CategoryController;
Route::get('/categories', [CategoryController::class, 'index']);

// Comments with AI Moderation (public)
use App\Http\Controllers\Api\CommentController;
Route::get('/blogs/{blogId}/comments', [CommentController::class, 'index']);
Route::post('/blogs/{blogId}/comments', [CommentController::class, 'store']);
Route::post('/blogs/{blogId}/comments/classify', [CommentController::class, 'quickCheck']);
Route::post('/blogs/{blogId}/comments/confirm', [CommentController::class, 'confirmPost']);

// Moderation (public for admin dashboard)
Route::get('/moderation/logs', [CommentController::class, 'getModerationLogs']);
Route::get('/moderation/stats', [CommentController::class, 'getModerationStats']);

// Comment actions (Admin/Moderator)
Route::get('/comments/{commentId}/detail', [CommentController::class, 'getCommentDetail']);
Route::delete('/comments/{commentId}', [CommentController::class, 'destroy']);

// Admin reply to comments (cần đăng nhập)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/comments/{commentId}/reply', [CommentController::class, 'reply']);
});

