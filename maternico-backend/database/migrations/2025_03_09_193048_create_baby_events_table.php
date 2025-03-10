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
        Schema::create('baby_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('baby_id')->constrained('babies')->onDelete('cascade');
            $table->string('event_title', 64);
            $table->string('description', 255)->nullable();
            $table->date('date');
            $table->string('photo_path', 2048)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('baby_events');
    }
};
