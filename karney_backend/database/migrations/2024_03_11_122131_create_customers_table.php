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
        Schema::create('customers', function (Blueprint $table) {
            // Primary Key
            $table->id();

            // Customer Details
            $table->string('full_name');
            $table->string('phone_number')->unique();
            $table->string('email')->nullable()->unique();
            $table->string('password');
            $table->string('CIN', 20)->nullable()->unique(); // Added length limit for CIN
            $table->string('image')->nullable(); // Store the path to the profile image

            // Timestamps
            $table->timestamps();

            // Indexes
            $table->index('phone_number'); // Add index for faster lookups
            $table->index('email'); // Add index for faster lookups
            $table->index('CIN'); // Add index for faster lookups
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
