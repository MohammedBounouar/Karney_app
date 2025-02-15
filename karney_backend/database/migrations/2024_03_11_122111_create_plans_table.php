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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Name of the plan (e.g., Basic, Pro, Premium)
            $table->decimal('price', 8, 2); // Price for the plan
            $table->integer('customers_limit'); // Customers limit (e.g., number of projects allowed)
            $table->timestamps();
        });

        
        // Insert default data into the 'plans' table
        DB::table('plans')->insert([
            [
                'name' => 'Free',
                'price' => 0.00,
                'customers_limit' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Basic',
                'price' => 30.00,
                'customers_limit' => 15,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Premium',
                'price' => 50.00,
                'customers_limit' => 25,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
