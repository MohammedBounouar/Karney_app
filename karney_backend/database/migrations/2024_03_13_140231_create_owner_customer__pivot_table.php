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
        Schema::create('owner_customer_pivot', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('storeOwnerId');
            $table->unsignedBigInteger('CustomerId');
            $table->timestamps();

            $table->foreign('storeOwnerId')->references('id')->on('store_owners')->onDelete('cascade');
            $table->foreign('CustomerID')->references('id')->on('customers')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('owner_customer_pivot');
    }
};
