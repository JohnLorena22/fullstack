<?php

use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;

// Test if the backend API is working
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'Backend API is working!',
    ]);
});

// Default Laravel authenticated user route
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('products', ProductController::class);
Route::apiResource('employees', EmployeeController::class);