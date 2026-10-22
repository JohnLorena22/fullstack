<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;

class ProductController extends Controller
{
    // Get all products
    public function index()
    {
        return response()->json(Product::orderBy('id', 'desc')->get());
    }

    // Create a product
    public function store(ProductRequest $request)
    {
        $product = Product::create($request->validated());

        return response()->json($product, 201);
    }

    // Get one product
    public function show(Product $product)
    {
        return response()->json($product);
    }

    // Update a product
    public function update(ProductRequest $request, Product $product)
    {
        $product->update($request->validated());

        return response()->json($product);
    }

    // Delete a product
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully.',
        ]);
    }
}
