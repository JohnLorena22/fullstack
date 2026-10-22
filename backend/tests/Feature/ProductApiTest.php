<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_lists_products_newest_first(): void
    {
        $first = Product::create(['name' => 'First', 'price' => 1]);
        $second = Product::create(['name' => 'Second', 'price' => 2]);

        $this->getJson('/api/products')
            ->assertOk()
            ->assertJsonPath('0.id', $second->id)
            ->assertJsonPath('1.id', $first->id);
    }

    public function test_it_creates_a_product_with_formatted_price(): void
    {
        $this->postJson('/api/products', ['name' => 'Mouse', 'price' => 12.5])
            ->assertCreated()
            ->assertJsonPath('price', '12.50');
    }

    public function test_it_validates_product_on_create(): void
    {
        $this->postJson('/api/products', ['price' => -1])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'price']);
    }

    public function test_it_partially_updates_a_product(): void
    {
        $product = Product::create(['name' => 'Mouse', 'price' => 10]);

        $this->patchJson("/api/products/{$product->id}", ['price' => 15])
            ->assertOk()
            ->assertJsonPath('name', 'Mouse')
            ->assertJsonPath('price', '15.00');
    }

    public function test_it_deletes_a_product(): void
    {
        $product = Product::create(['name' => 'Mouse', 'price' => 10]);

        $this->deleteJson("/api/products/{$product->id}")->assertOk();

        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }
}
