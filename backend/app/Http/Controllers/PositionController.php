<?php

namespace App\Http\Controllers;

use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PositionController extends Controller
{
    public function index(Request $request)
    {
        $query = Position::with('department')->orderBy('name');

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'department_id' => ['required', 'integer', 'exists:departments,id'],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('positions', 'name')
                    ->where('department_id', $request->input('department_id')),
            ],
            'description' => ['nullable', 'string'],
        ]);

        $position = Position::create($validated);

        return response()->json(
            $position->load('department'),
            201
        );
    }

    public function show(Position $position)
    {
        return response()->json($position->load('department'));
    }

    public function update(Request $request, Position $position)
    {
        $validated = $request->validate([
            'department_id' => ['required', 'integer', 'exists:departments,id'],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('positions', 'name')
                    ->where('department_id', $request->input('department_id'))
                    ->ignore($position->id),
            ],
            'description' => ['nullable', 'string'],
        ]);

        $position->update($validated);

        return response()->json(
            $position->load('department')
        );
    }

    public function destroy(Position $position)
    {
        if ($position->employees()->exists()) {
            return response()->json([
                'message' => 'Cannot delete a position assigned to employees.',
            ], 422);
        }

        $position->delete();

        return response()->json([
            'message' => 'Position deleted successfully.',
        ]);
    }
}