<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeRequest;
use App\Models\Employee;

class EmployeeController extends Controller
{
    public function index()
    {
        return response()->json(
            Employee::orderBy('id', 'desc')->get()
        );
    }

    public function store(EmployeeRequest $request)
    {
        $employee = Employee::create($request->validated());

        return response()->json($employee, 201);
    }

    public function show(Employee $employee)
    {
        return response()->json($employee);
    }

    public function update(EmployeeRequest $request, Employee $employee)
    {
        $employee->update($request->validated());

        return response()->json($employee);
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();

        return response()->json([
            'message' => 'Employee deleted successfully.',
        ]);
    }
}
