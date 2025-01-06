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
        Schema::create('task_reports', function (Blueprint $table) {
            $table->string('email'); 
            $table->string('role'); // Add role column
            $table->date('date')->nullable(); // Task date
            $table->text('task_details')->nullable(); // Task details
            $table->integer('hours_worked')->default(0); // Hours worked
            $table->enum('status', ['submitted', 'reviewed']);
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null'); // Foreign key for user
            $table->foreignId('role_id')->nullable()->constrained('roles')->onDelete('set null'); // Foreign key for role
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_reports');
    }
};
