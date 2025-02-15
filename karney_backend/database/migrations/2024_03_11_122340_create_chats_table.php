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
    Schema::create('chats', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('sender_id');
        $table->unsignedBigInteger('receiver_id');
        $table->text('message_text');
        $table->timestamps();

        $table->foreign('receiver_id')->references('id')->on('customers')->onDelete('cascade');
        $table->foreign('sender_id')->references('id')->on('store_owners')->onDelete('cascade');

    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chats');
    }
};
