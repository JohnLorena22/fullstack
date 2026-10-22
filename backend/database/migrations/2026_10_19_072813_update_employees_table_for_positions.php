<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Remove test employee records first.
        DB::table('employees')->delete();

        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn(['department', 'position']);
        });

        Schema::table('employees', function (Blueprint $table) {
            $table->foreignId('position_id')
                ->constrained('positions')
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropForeign(['position_id']);
            $table->dropColumn('position_id');
        });

        Schema::table('employees', function (Blueprint $table) {
            $table->string('department');
            $table->string('position');
        });
    }
};