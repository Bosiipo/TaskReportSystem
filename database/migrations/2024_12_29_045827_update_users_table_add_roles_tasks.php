<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateUsersTableAddRolesTasks extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')->nullable()->onDelete('set null');
            $table->date('date')->nullable(); // Task date
            $table->text('task_details')->nullable(); // Task details
            $table->integer('hours_worked')->default(0); // Hours worked
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('set null'); // Foreign key for department
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['date', 'task_details', 'hours_worked']);
            $table->dropForeign(['department_id', 'role_id']);
        });
    }
}

