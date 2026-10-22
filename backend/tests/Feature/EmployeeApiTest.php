<?php

namespace Tests\Feature;

use App\Models\Employee;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmployeeApiTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'jane@example.com',
            'phone' => '555-0100',
            'department' => 'IT',
            'position' => 'Support Specialist',
        ], $overrides);
    }

    public function test_it_lists_employees_newest_first(): void
    {
        $first = Employee::create($this->payload(['email' => 'first@example.com']));
        $second = Employee::create($this->payload(['email' => 'second@example.com']));

        $this->getJson('/api/employees')
            ->assertOk()
            ->assertJsonCount(2)
            ->assertJsonPath('0.id', $second->id)
            ->assertJsonPath('1.id', $first->id);
    }

    public function test_it_creates_an_employee(): void
    {
        $this->postJson('/api/employees', $this->payload())
            ->assertCreated()
            ->assertJsonPath('email', 'jane@example.com');

        $this->assertDatabaseHas('employees', ['email' => 'jane@example.com']);
    }

    public function test_it_validates_required_fields(): void
    {
        $this->postJson('/api/employees', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['first_name', 'last_name', 'email', 'department', 'position']);
    }

    public function test_it_normalizes_email_and_rejects_case_insensitive_duplicates(): void
    {
        $this->postJson('/api/employees', $this->payload(['email' => '  Jane@Example.COM ']))
            ->assertCreated()
            ->assertJsonPath('email', 'jane@example.com');

        $this->postJson('/api/employees', $this->payload(['email' => 'JANE@example.com']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_it_shows_an_employee(): void
    {
        $employee = Employee::create($this->payload());

        $this->getJson("/api/employees/{$employee->id}")
            ->assertOk()
            ->assertJsonPath('id', $employee->id);
    }

    public function test_it_updates_an_employee_keeping_its_own_email(): void
    {
        $employee = Employee::create($this->payload());

        $this->putJson("/api/employees/{$employee->id}", $this->payload(['position' => 'Team Lead']))
            ->assertOk()
            ->assertJsonPath('position', 'Team Lead');
    }

    public function test_it_rejects_updating_to_another_employees_email(): void
    {
        Employee::create($this->payload(['email' => 'taken@example.com']));
        $employee = Employee::create($this->payload());

        $this->putJson("/api/employees/{$employee->id}", $this->payload(['email' => 'Taken@example.com']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_it_deletes_an_employee(): void
    {
        $employee = Employee::create($this->payload());

        $this->deleteJson("/api/employees/{$employee->id}")->assertOk();

        $this->assertDatabaseMissing('employees', ['id' => $employee->id]);
    }

    public function test_it_returns_json_404_for_missing_employee(): void
    {
        $this->getJson('/api/employees/999')->assertNotFound();
    }
}
