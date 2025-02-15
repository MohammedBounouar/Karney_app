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
        Schema::create('total_transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('CustomerID');
            $table->decimal('Total');
            $table->timestamps();
            
            $table->foreign('CustomerID')->references('id')->on('customers')->onDelete('cascade');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('total_transactions');
    }
};
