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
        Schema::create('store_owners', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('phone_number')->unique();
            $table->string('email')->nullable()->unique();
            $table->string('password');
            $table->string('CIN')->nullable()->unique();
            $table->unsignedBigInteger('plan_id')->default(1);
            $table->timestamps();

            $table->foreign('plan_id')->references('id')->on('plans')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('_store_owners');
    }
};
