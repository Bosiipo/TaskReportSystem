<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('task_report', function (Blueprint $table) {
            $table->string('email'); 
            $table->string('role')->default('Employee'); // Add role column
            $table->date('date')->nullable(); // Task date
            $table->text('task_details')->nullable(); // Task details
            $table->integer('hours_worked')->default(0); // Hours worked
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('set null'); // Foreign key for department
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null'); // Foreign key for department
            $table->foreignId('role_id')->nullable()->constrained('roles')->onDelete('set null'); // Foreign key for department
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_report');
    }
};
