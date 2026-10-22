<?php

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

// Product management
Route::apiResource('products', ProductController::class);

// Employee management
Route::apiResource('employees', EmployeeController::class);

// Department management
Route::apiResource('departments', DepartmentController::class);

// Position management
Route::apiResource('positions', PositionController::class);